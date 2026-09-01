/** Plain, serializable domain shapes passed from server to client components. */

export interface CategoryDTO {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  productCount?: number
}

export interface BrandDTO {
  id: string
  name: string
  slug: string
}

export interface ProductDTO {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  imageUrl: string
  rating: number
  featured: boolean
  category: { name: string; slug: string }
  brand: { name: string; slug: string } | null
}

export interface CartLineDTO {
  productId: string
  name: string
  slug: string
  imageUrl: string
  price: number
  quantity: number
  stock: number
}

export interface CartDTO {
  lines: CartLineDTO[]
  itemCount: number
  subtotal: number
}

export interface OrderItemDTO {
  id: string
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number
  productSlug: string | null
}

export interface OrderDTO {
  id: string
  reference: string
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  createdAt: string
  items: OrderItemDTO[]
}

export interface SessionUserDTO {
  id: string
  login: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'
}

export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
