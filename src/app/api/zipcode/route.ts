// src/app/api/city/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const zip = searchParams.get('zip') ?? ''
console.log('heeeeeapi_zip');
  const appid = process.env.APP_ID 
  const limit = process.env.LIMIT
const url = process.env.API_ZIP_URL || ""
  try {
    const res = await axios.get(url, {
      params: {
        zip,
        appid,
        limit,
      },
    })

    return NextResponse.json(res.data)
  } catch (err) {
    console.error('OpenZipMap error:', err)
    return NextResponse.json({ error: 'Failed to fetch zip data' }, { status: 500 })
  }
}
