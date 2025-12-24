import { NextResponse, NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }
  if (!tag) {
    return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
  }
  revalidateTag(tag)
  return NextResponse.json({ revalidated: true, now: Date.now() })
}