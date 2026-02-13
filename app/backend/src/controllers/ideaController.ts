import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabase } from '../services/supabase'

export async function createIdea(req: AuthRequest, res: Response) {
  try {
    const { title, description, industry, target_market } = req.body
    const userId = req.user!.id

    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: userId,
        title,
        description,
        raw_input: description,
        industry,
        target_market,
        status: 'draft'
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Create idea error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function getIdeas(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id

    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (error: any) {
    console.error('Get ideas error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function getIdea(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Idea not found' })

    res.json(data)
  } catch (error: any) {
    console.error('Get idea error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function updateIdea(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const { title, description, industry, target_market } = req.body
    const userId = req.user!.id

    const { data, error } = await supabase
      .from('ideas')
      .update({
        title,
        description,
        industry,
        target_market,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Idea not found' })

    res.json(data)
  } catch (error: any) {
    console.error('Update idea error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function deleteIdea(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Idea deleted successfully' })
  } catch (error: any) {
    console.error('Delete idea error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function archiveIdea(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const { data, error } = await supabase
      .from('ideas')
      .update({ status: 'archived' })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Idea not found' })

    res.json(data)
  } catch (error: any) {
    console.error('Archive idea error:', error)
    res.status(500).json({ error: error.message })
  }
}