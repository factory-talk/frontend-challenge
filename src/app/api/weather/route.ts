// src/app/api/weather/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
console.log('heeeeeapi');
  const appid = process.env.NEXT_PUBLIC_APP_ID || "43a236a5cc90fceafcc1e89dfefbb8fa"
  const limit = process.env.NEXT_PUBLIC_LIMIT ?? '5'

  try {
    const res = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q,
        appid,
        limit,
      },
    })

    return NextResponse.json(res.data)
  } catch (err) {
    console.error('OpenWeatherMap error:', err)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}
