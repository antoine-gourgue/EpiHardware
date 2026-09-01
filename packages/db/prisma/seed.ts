import { PrismaClient, Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import { DEMO_BRANDS, DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_USERS } from '../src/demo-data'

const prisma = new PrismaClient()

faker.seed(42)

async function main() {
  console.log('🌱  Reset…')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.product.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗂️   Categories & brands…')
  const categories = new Map<string, string>()
  for (const c of DEMO_CATEGORIES) {
    const row = await prisma.category.create({ data: c })
    categories.set(c.slug, row.id)
  }
  const brands = new Map<string, string>()
  for (const b of DEMO_BRANDS) {
    const row = await prisma.brand.create({ data: b })
    brands.set(b.slug, row.id)
  }

  console.log('💻  Products…')
  const productIds: string[] = []
  for (const p of DEMO_PRODUCTS) {
    const row = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: new Prisma.Decimal(p.price),
        stock: p.stock,
        imageUrl: p.imageUrl,
        rating: p.rating,
        featured: p.featured,
        categoryId: categories.get(p.categorySlug)!,
        brandId: brands.get(p.brandSlug) ?? null
      }
    })
    productIds.push(row.id)
  }

  console.log('👤  Users…')
  const created = []
  for (const u of DEMO_USERS) {
    const row = await prisma.user.create({
      data: {
        login: u.login,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        password: await bcrypt.hash(u.password, 10),
        cart: { create: {} }
      }
    })
    created.push(row)
  }

  console.log('🧾  Order history…')
  const products = await prisma.product.findMany()
  for (const user of created) {
    const orderCount = faker.number.int({ min: 1, max: 4 })
    for (let o = 0; o < orderCount; o++) {
      const picks = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 4 }))
      const items = picks.map((p) => ({
        productId: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        unitPrice: p.price,
        quantity: faker.number.int({ min: 1, max: 2 })
      }))
      const total = items.reduce(
        (sum, it) => sum.plus(new Prisma.Decimal(it.unitPrice).times(it.quantity)),
        new Prisma.Decimal(0)
      )
      await prisma.order.create({
        data: {
          reference: `EPI-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
          userId: user.id,
          status: faker.helpers.arrayElement(['PAID', 'SHIPPED', 'DELIVERED']),
          total,
          createdAt: faker.date.recent({ days: 120 }),
          items: { create: items }
        }
      })
    }
  }

  console.log('✅  Seed complete:')
  console.log(
    `   ${DEMO_CATEGORIES.length} categories · ${DEMO_BRANDS.length} brands · ${productIds.length} products · ${created.length} users`
  )
  console.log('   Login: demo@epihardware.dev / password  ·  admin@epihardware.dev / password')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
