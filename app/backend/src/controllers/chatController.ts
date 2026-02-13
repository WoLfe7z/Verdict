import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabase } from '../services/supabase'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function sendMessage(req: AuthRequest, res: Response) {
    try {
        const { ideaId } = req.params
        const { message } = req.body
        const userId = req.user!.id

        if (!message || message.trim().length === 0)
            return res.status(400).json({ error: 'Message is required' })

        // Get idea context
        const { data: idea } = await supabase
            .from('ideas')
            .select('description, title')
            .eq('id', ideaId)
            .eq('user_id', userId)
            .single()

        if (!idea)
            return res.status(404).json({ error: 'Idea not found' })

        // Get chat history
        const { data: history } = await supabase
            .from('feedback_sessions')
            .select('question, ai_response')
            .eq('idea_id', ideaId)
            .order('created_at', { ascending: true })
            .limit(10)

        // Build messages array for Claude
        const messages: any[] = []
        
        // Add context as first message
        messages.push({
            role: 'user',
            content: `I'm working on this business idea: "${idea.title}"\n\nDescription: ${idea.description}\n\nPlease help me refine and develop this idea.`
        })

        messages.push({
            role: 'assistant',
            content: 'I understand your business idea. How can I help you develop it further?'
        })

        // Add chat history
        history?.forEach(h => {
            messages.push({ role: 'user', content: h.question })
            messages.push({ role: 'assistant', content: h.ai_response })
        })

        // Add current message
        messages.push({ role: 'user', content: message })

        // Get AI response
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages
        })

        const aiResponse = response.content[0].type === 'text' ? response.content[0].text : ''

        // Save to database
        const { data: saved } = await supabase
            .from('feedback_sessions')
            .insert({
                idea_id: ideaId,
                user_id: userId,
                question: message,
                ai_response: aiResponse
            })
            .select()
            .single()

        res.json(saved)

    } catch (error: any) {
        console.error('Chat error:', error)
        res.status(500).json({ error: error.message })
    }
}

export async function getChatHistory(req: AuthRequest, res: Response) {
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

        const { data, error } = await supabase
            .from('feedback_sessions')
            .select('*')
            .eq('idea_id', ideaId)
            .order('created_at', { ascending: true })

        if (error) throw error

        res.json(data || [])

    } catch (error: any) {
        console.error('Get chat history error:', error)
        res.status(500).json({ error: error.message })
    }
}