import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/data/catalog'

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get('q')?.trim() ?? ''
  if (term.length < 2) return NextResponse.json({ results: [] })

  const products = await searchProducts(term, 6)
  return NextResponse.json({
    results: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category.name
    }))
  })
}
