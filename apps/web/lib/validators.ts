import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
})

export const registerSchema = z
  .object({
    login: z.string().min(3, 'Au moins 3 caractères').max(32),
    firstName: z.string().min(1, 'Prénom requis').max(60),
    lastName: z.string().min(1, 'Nom requis').max(60),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Au moins 8 caractères'),
    confirmPassword: z.string()
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  })

export const profileSchema = z.object({
  login: z.string().min(3).max(32),
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  email: z.string().email('Email invalide'),
  password: z.union([z.string().min(8, 'Au moins 8 caractères'), z.literal('')]).optional()
})

export const productSchema = z.object({
  name: z.string().min(2, 'Nom trop court').max(120),
  description: z.string().min(10, 'Description trop courte'),
  price: z.coerce.number().positive('Prix invalide'),
  stock: z.coerce.number().int().min(0, 'Stock invalide'),
  imageUrl: z.string().url('URL invalide'),
  categoryId: z.string().min(1, 'Catégorie requise'),
  brandId: z.string().optional().nullable(),
  featured: z.coerce.boolean().optional()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ProductInput = z.infer<typeof productSchema>
