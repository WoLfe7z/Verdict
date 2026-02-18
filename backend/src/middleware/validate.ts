import { Request, Response, NextFunction } from 'express'

export function validateIdeaInput(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { title, description } = req.body

    if (!title || title.trim().length === 0) 
        return res.status(400).json({ error: 'Title is required' })

    if (!description || description.trim().length === 0)
        return res.status(400).json({ error: 'Description is required' })

    if (description.length < 50) {
        return res.status(400).json({ 
            error: 'Description must be at least 50 characters' 
        })
    }

    next()
}