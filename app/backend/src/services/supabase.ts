import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables:')
  console.error('SUPABASE_URL:', supabaseUrl)
  console.error('SUPABASE_SERVICE_KEY:', supabaseKey ? 'exists' : 'missing')
  throw new Error('Missing Supabase credentials in .env file')
}

export const supabase = createClient(supabaseUrl, supabaseKey)