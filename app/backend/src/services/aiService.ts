import Anthropic from '@anthropic-ai/sdk'   // LLM service integration

const anthropic = new Anthropic({
  apiKey: process.env.LLM_API_KEY,
})

export async function analyzeBusinessIdea(ideaDescription: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `You are a business analyst. Analyze this entrepreneurial idea and provide:

1. Current business phase (idea/validation/mvp/growth/scale)
2. Viability score (0-100)
3. SWOT analysis (strengths, weaknesses, opportunities, threats)
4. Key metrics to track
5. Market analysis
6. Top 3-5 competitors

Business Idea: ${ideaDescription}

Respond ONLY with valid JSON in this exact format:
{
  "phase": "string",
  "viability_score": number,
  "swot": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "key_metrics": {
    "metric_name": "description"
  },
  "market_analysis": {
    "size": "string",
    "growth": "string",
    "trends": ["string"]
  },
  "competitors": [
    {
      "name": "string",
      "description": "string",
      "strength_level": "direct/indirect/potential"
    }
  ]
}`
      }
    ]
  })

  const responseText = message.content[0].type === 'text' 
    ? message.content[0].text 
    : ''

  // Parse JSON response
  const analysis = JSON.parse(responseText)
  return analysis
}

export async function generateActionPlan(ideaDescription: string, analysis: any) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Based on this business idea and analysis, create a detailed action plan.

Business Idea: ${ideaDescription}

Current Phase: ${analysis.phase}
Viability Score: ${analysis.viability_score}

Create a step-by-step action plan with:
- Timeline in months
- Specific steps organized by phase
- Dependencies between steps
- Resources needed
- Priority levels

Respond ONLY with valid JSON in this format:
{
  "timeline_months": number,
  "steps": [
    {
      "step_number": number,
      "phase": "string",
      "title": "string",
      "description": "string",
      "estimated_duration": "string",
      "priority": "high/medium/low",
      "dependencies": [step_numbers],
      "resources_needed": {
        "budget": "string",
        "tools": ["string"],
        "people": ["string"]
      }
    }
  ]
}`
      }
    ]
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  return JSON.parse(responseText)
}