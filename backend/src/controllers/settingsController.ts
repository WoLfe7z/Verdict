import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabase } from '../services/supabase'

export async function getSettings(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    res.json(data || { id: userId, email: req.user!.email })

  } catch (error: any) {
    console.error('Get settings error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function updateSettings(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    const { full_name, company_name, role, avatar_url } = req.body

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name,
        company_name,
        role,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

     if (error) {
      console.error('Supabase upsert error:', error)  // ← Dodaj
      throw error
    }

    res.json(data)

  } catch (error: any) {
    console.error('Update settings error:', error)
    res.status(500).json({ error: error.message })
  }
}