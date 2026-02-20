import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // Params are a promise that resolves to an object containing the id parameter
) {
  try {
    const token = request.headers.get('authorization')
    const { id } = await params
    
    const response = await fetch(`${BACKEND_URL}/api/ideas/${id}`, {
      headers: { 'Authorization': token || '' }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')
    const body = await request.json()
    const { id } = await params
    
    const response = await fetch(`${BACKEND_URL}/api/ideas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')
    const { id } = await params
    
    const response = await fetch(`${BACKEND_URL}/api/ideas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token || '' }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}