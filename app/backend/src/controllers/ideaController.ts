import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabase } from '../services/supabase'
import { analyzeBusinessIdea, generateActionPlan } from '../services/aiService'

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

export async function analyzeIdea(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = req.user!.id

    // Get the idea
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (ideaError || !idea) {
      return res.status(404).json({ error: 'Idea not found' })
    }

    // Update status to analyzing
    await supabase
      .from('ideas')
      .update({ status: 'analyzing' })
      .eq('id', id)

    // Call AI to analyze
    const analysis = await analyzeBusinessIdea(idea.description)

    // Save analysis to database
    const { data: savedAnalysis, error: analysisError } = await supabase
      .from('analyses')
      .insert({
        idea_id: id,
        current_phase: analysis.phase,
        viability_score: analysis.viability_score,
        strengths: analysis.swot.strengths,
        weaknesses: analysis.swot.weaknesses,
        opportunities: analysis.swot.opportunities,
        threats: analysis.swot.threats,
        market_analysis: analysis.market_analysis,
        key_metrics: analysis.key_metrics,
        ai_model_used: 'claude-sonnet-4'
      })
      .select()
      .single()

    if (analysisError) throw analysisError

    // Save competitors
    if (analysis.competitors?.length > 0) {
      await supabase
        .from('competitors')
        .insert(
          analysis.competitors.map((comp: any) => ({
            idea_id: id,
            name: comp.name,
            description: comp.description,
            strength_level: comp.strength_level
          }))
        )
    }

    // Generate action plan
    const plan = await generateActionPlan(idea.description, analysis)

    const { data: savedPlan, error: planError } = await supabase
      .from('action_plans')
      .insert({
        idea_id: id,
        analysis_id: savedAnalysis.id,
        timeline_months: plan.timeline_months,
        total_steps: plan.steps.length
      })
      .select()
      .single()

    if (planError) throw planError

    // Save action steps
    await supabase
      .from('action_steps')
      .insert(
        plan.steps.map((step: any) => ({
          action_plan_id: savedPlan.id,
          step_number: step.step_number,
          phase: step.phase,
          title: step.title,
          description: step.description,
          estimated_duration: step.estimated_duration,
          priority: step.priority,
          dependencies: step.dependencies,
          resources_needed: step.resources_needed
        }))
      )

    // Update idea status
    await supabase
      .from('ideas')
      .update({ status: 'completed' })
      .eq('id', id)

    res.json({
      analysis: savedAnalysis,
      plan: savedPlan,
      message: 'Analysis completed successfully'
    })

  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze idea' })
  }
}