import { Request, Response } from 'express'
import { supabase } from '../services/supabase'

export async function signup(req: Request, res: Response) {
    try {
        const { email, password, full_name } = req.body

        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required' })

        if (password.length < 6)
            return res.status(400).json({ error: 'Password must be at least 6 characters' })

        // Create user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                full_name: full_name || null
                }
            }
        })

        if (error)
            return res.status(400).json({ error: error.message })

        res.status(201).json({
            user: data.user,
            session: data.session,
            message: 'User created successfully'
        })

    } catch (error: any) {
        console.error('Signup error:', error)
        res.status(500).json({ error: error.message })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required' })

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error)
            return res.status(401).json({ error: 'Invalid credentials' })

        res.json({
            user: data.user,
            session: data.session,
            access_token: data.session?.access_token
        })

    } catch (error: any) {
        console.error('Login error:', error)
        res.status(500).json({ error: error.message })
    }
}

export async function logout(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7)
        
            // Sign out the user
            await supabase.auth.signOut()
        }

        res.json({ message: 'Logged out successfully' })

    } catch (error: any) {
        console.error('Logout error:', error)
        res.status(500).json({ error: error.message })
    }
}

export async function getCurrentUser(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ error: 'No token provided' })

        const token = authHeader.substring(7)

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user)
            return res.status(401).json({ error: 'Invalid token' })

        res.json({ user })

    } catch (error: any) {
        console.error('Get user error:', error)
        res.status(500).json({ error: error.message })
    }
}