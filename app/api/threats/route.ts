import { NextResponse } from "next/server"
import { LiquidModelService } from "@/services/liquid-model-service"

const liquidModel = LiquidModelService.getInstance()

export async function GET() {
  try {
    const threats = await liquidModel.getThreats()
    return NextResponse.json(threats)
  } catch (error) {
    console.error('Error fetching threats:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const threat = liquidModel.getThreat(data.id)
    
    if (!threat) {
      return new NextResponse('Threat not found', { status: 404 })
    }
    
    return NextResponse.json(threat)
  } catch (error) {
    console.error('Error processing threat:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
