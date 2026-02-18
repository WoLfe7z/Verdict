import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabase } from '../services/supabase'

export async function getDashboardStats(req: AuthRequest, res: Response) {
    try {
        const userId = req.user!.id

        // Get total ideas count
        const { count: totalIdeas } = await supabase
            .from('ideas')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        // Get ideas by status (id for later use)
        const { data: ideas } = await supabase
            .from('ideas')
            .select('id, status') 
            .eq('user_id', userId)

        const statusCounts = {
            draft: 0,
            analyzing: 0,
            completed: 0,
            archived: 0
        }

        ideas?.forEach(idea => {
            if (idea.status in statusCounts) {
                statusCounts[idea.status as keyof typeof statusCounts]++
            }
        })

        // Get recent ideas
        const { data: recentIdeas } = await supabase
            .from('ideas')
            .select('id, title, status, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5)

        // Get average viability score
        const { data: analyses } = await supabase
            .from('analyses')
            .select('viability_score, idea_id')
            .in('idea_id', ideas?.map(i => i.id) || [])

        const avgViability = analyses && analyses.length > 0 ? analyses.reduce((sum, a) => sum + (a.viability_score || 0), 0) / analyses.length : 0

        res.json({
            totalIdeas: totalIdeas || 0,
            statusCounts,
            recentIdeas: recentIdeas || [],
            averageViability: Math.round(avgViability)
        })

    } catch (error: any) {
        console.error('Dashboard stats error:', error)
        res.status(500).json({ error: error.message })
    }
}