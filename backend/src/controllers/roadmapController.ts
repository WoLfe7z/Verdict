import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabase } from '../services/supabase'

export async function getRoadmap(req: AuthRequest, res: Response) {
    try {
        const { ideaId } = req.params
        const userId = req.user!.id

        // Verify idea belongs to user
        const { data: idea } = await supabase
            .from('ideas')
            .select('id')
            .eq('id', ideaId)
            .eq('user_id', userId)
            .single()

        if (!idea)
            return res.status(404).json({ error: 'Idea not found' })

        // Get action plan with steps
        const { data: plan, error: planError } = await supabase
            .from('action_plans')
            .select(`
                *,
                action_steps (*)
            `)
            .eq('idea_id', ideaId)
            .order('created_at', { foreignTable: 'action_steps', ascending: true })
            .single()

        if (planError)
            return res.status(404).json({ error: 'No roadmap found for this idea' })

        res.json(plan)

    } catch (error: any) {
        console.error('Get roadmap error:', error)
        res.status(500).json({ error: error.message })
    }
}

export async function updateStep(req: AuthRequest, res: Response) {
    try {
        const { ideaId, stepId } = req.params
        const updates = req.body
        const userId = req.user!.id

        // Verify idea belongs to user
        const { data: idea } = await supabase
            .from('ideas')
            .select('id')
            .eq('id', ideaId)
            .eq('user_id', userId)
            .single()

        if (!idea)
            return res.status(404).json({ error: 'Idea not found' })

        const { data, error } = await supabase
            .from('action_steps')
            .update(updates)
            .eq('id', stepId)
            .select()
            .single()

        if (error) throw error

        res.json(data)

    } catch (error: any) {
        console.error('Update step error:', error)
        res.status(500).json({ error: error.message })
    }
}

export async function completeStep(req: AuthRequest, res: Response) {
    try {
        const { ideaId, stepId } = req.params
        const userId = req.user!.id

        // Verify idea belongs to user
        const { data: idea } = await supabase
            .from('ideas')
            .select('id')
            .eq('id', ideaId)
            .eq('user_id', userId)
            .single()

        if (!idea)
            return res.status(404).json({ error: 'Idea not found' })

        const { data, error } = await supabase
            .from('action_steps')
            .update({
                completed: true,
                completed_at: new Date().toISOString()
            })
            .eq('id', stepId)
            .select()
            .single()

        if (error) throw error

        res.json(data)

    } catch (error: any) {
        console.error('Complete step error:', error)
        res.status(500).json({ error: error.message })
    }
}