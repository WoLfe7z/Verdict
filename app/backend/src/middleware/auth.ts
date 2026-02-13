import { Request, Response, NextFunction } from 'express'
import { supabase } from '../services/supabase'

export interface AuthRequest extends Request {
    user?: {
        id: string
        email: string
    }
}

export async function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) 
            return res.status(401).json({ error: 'No token provided' })

        const token = authHeader.substring(7)

        // Verify JWT with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user)
            return res.status(401).json({ error: 'Invalid token' })

        req.user = {
            id: user.id,
            email: user.email!
        }

        next()
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' })
    }
}