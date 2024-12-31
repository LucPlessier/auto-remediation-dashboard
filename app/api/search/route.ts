import { NextResponse } from 'next/server'
import { LiquidModel } from '@/app/lib/liquid-model'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const liquidModel = new LiquidModel()
    const results = await liquidModel.search(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
