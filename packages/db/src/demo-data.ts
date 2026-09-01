/**
 * Curated demo catalogue — the single source of truth for both the database
 * seed (`prisma/seed.ts`) and the runtime demo mode used when `DATABASE_URL`
 * is absent. Keeping it here means the app shows the exact same store whether
 * or not Postgres is running.
 */

export interface DemoCategory {
  name: string
  slug: string
  description: string
  icon: string
}

export interface DemoBrand {
  name: string
  slug: string
}

export interface DemoProduct {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  imageUrl: string
  rating: number
  featured: boolean
  categorySlug: string
  brandSlug: string
}

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    name: 'Cartes graphiques',
    slug: 'gpu',
    description: 'GPU haute performance pour le gaming et la création.',
    icon: 'Cpu'
  },
  {
    name: 'Processeurs',
    slug: 'cpu',
    description: 'Le cœur de votre machine, du bureautique au workstation.',
    icon: 'CircuitBoard'
  },
  {
    name: 'Écrans',
    slug: 'monitors',
    description: 'Dalles rapides, HDR et haute résolution.',
    icon: 'Monitor'
  },
  {
    name: 'Claviers',
    slug: 'keyboards',
    description: 'Mécaniques, low-profile et sans-fil.',
    icon: 'Keyboard'
  },
  { name: 'Souris', slug: 'mice', description: 'Capteurs précis et ultra-légères.', icon: 'Mouse' },
  {
    name: 'Stockage',
    slug: 'storage',
    description: 'SSD NVMe et disques haute capacité.',
    icon: 'HardDrive'
  },
  {
    name: 'Mémoire',
    slug: 'memory',
    description: 'Kits DDR5 à haute fréquence.',
    icon: 'MemoryStick'
  },
  {
    name: 'Casques',
    slug: 'headsets',
    description: 'Audio immersif et micros clairs.',
    icon: 'Headphones'
  }
]

export const DEMO_BRANDS: DemoBrand[] = [
  { name: 'NVIDIA', slug: 'nvidia' },
  { name: 'AMD', slug: 'amd' },
  { name: 'Intel', slug: 'intel' },
  { name: 'ASUS', slug: 'asus' },
  { name: 'MSI', slug: 'msi' },
  { name: 'Corsair', slug: 'corsair' },
  { name: 'Logitech', slug: 'logitech' },
  { name: 'Razer', slug: 'razer' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Kingston', slug: 'kingston' }
]

interface Seed {
  name: string
  category: string
  brand: string
  price: number
  description: string
  featured?: boolean
}

const SEED: Seed[] = [
  {
    name: 'GeForce RTX 4090 Founders Edition',
    category: 'gpu',
    brand: 'nvidia',
    price: 1899.99,
    featured: true,
    description:
      'La carte graphique la plus puissante de sa génération. 24 Go GDDR6X, ray tracing et DLSS 3 pour un rendu 4K sans compromis.'
  },
  {
    name: 'GeForce RTX 4070 Ti SUPER',
    category: 'gpu',
    brand: 'nvidia',
    price: 879.0,
    description: '16 Go de mémoire vidéo pour le gaming 1440p ultra et la création de contenu.'
  },
  {
    name: 'Radeon RX 7900 XTX',
    category: 'gpu',
    brand: 'amd',
    price: 999.99,
    featured: true,
    description:
      'Architecture RDNA 3, 24 Go GDDR6. Des performances 4K exceptionnelles au meilleur rapport prix/watt.'
  },
  {
    name: 'Radeon RX 7800 XT',
    category: 'gpu',
    brand: 'amd',
    price: 549.0,
    description: 'Le choix parfait pour le 1440p haute fréquence.'
  },
  {
    name: 'GeForce RTX 4060 Ventus',
    category: 'gpu',
    brand: 'msi',
    price: 329.99,
    description: 'Compacte et efficace, idéale pour un premier build gaming 1080p.'
  },

  {
    name: 'Ryzen 9 7950X',
    category: 'cpu',
    brand: 'amd',
    price: 649.0,
    featured: true,
    description:
      '16 cœurs, 32 threads jusqu’à 5,7 GHz. Le processeur ultime pour la productivité et le jeu.'
  },
  {
    name: 'Ryzen 7 7800X3D',
    category: 'cpu',
    brand: 'amd',
    price: 449.99,
    featured: true,
    description: 'La technologie 3D V-Cache pour les meilleures performances gaming du marché.'
  },
  {
    name: 'Core i9-14900K',
    category: 'cpu',
    brand: 'intel',
    price: 589.0,
    description:
      '24 cœurs hybrides, jusqu’à 6,0 GHz. Une puissance brute pour les charges les plus lourdes.'
  },
  {
    name: 'Core i5-14600K',
    category: 'cpu',
    brand: 'intel',
    price: 319.99,
    description: 'Le meilleur rapport performance/prix pour un PC gaming milieu de gamme.'
  },

  {
    name: 'ROG Swift OLED PG27AQDM 27"',
    category: 'monitors',
    brand: 'asus',
    price: 899.0,
    featured: true,
    description: 'Dalle OLED 1440p 240 Hz, 0,03 ms. Des noirs parfaits et une réactivité extrême.'
  },
  {
    name: 'Odyssey G9 49" Curved',
    category: 'monitors',
    brand: 'samsung',
    price: 1099.99,
    description: 'Ultrawide immersif 32:9, 240 Hz. Comme deux écrans QHD réunis.'
  },
  {
    name: 'TUF Gaming VG27AQ 27"',
    category: 'monitors',
    brand: 'asus',
    price: 279.0,
    description: 'IPS 1440p 165 Hz avec G-Sync compatible. L’équilibre idéal.'
  },
  {
    name: 'ViewFinity S8 32" 4K',
    category: 'monitors',
    brand: 'samsung',
    price: 449.99,
    description: 'Écran 4K UHD calibré pour les créatifs, USB-C 90 W.'
  },

  {
    name: 'ROG Azoth 75%',
    category: 'keyboards',
    brand: 'asus',
    price: 249.99,
    featured: true,
    description: 'Clavier mécanique sans-fil gasket-mount avec écran OLED et switches NX.'
  },
  {
    name: 'BlackWidow V4 Pro',
    category: 'keyboards',
    brand: 'razer',
    price: 229.0,
    description: 'Switches Razer Green, molette de commande et repose-poignet magnétique.'
  },
  {
    name: 'K70 RGB PRO',
    category: 'keyboards',
    brand: 'corsair',
    price: 169.99,
    description: 'Cherry MX, châssis aluminium et polling 8000 Hz.'
  },
  {
    name: 'G915 TKL LIGHTSPEED',
    category: 'keyboards',
    brand: 'logitech',
    price: 209.0,
    description: 'Low-profile sans-fil ultra-fin, autonomie 40 h.'
  },

  {
    name: 'G Pro X Superlight 2',
    category: 'mice',
    brand: 'logitech',
    price: 159.99,
    featured: true,
    description: '60 g, capteur HERO 2 à 32 000 DPI. La référence e-sport sans-fil.'
  },
  {
    name: 'DeathAdder V3 Pro',
    category: 'mice',
    brand: 'razer',
    price: 149.0,
    description: 'Forme ergonomique iconique, 63 g, capteur Focus Pro 30K.'
  },
  {
    name: 'M65 RGB Ultra Wireless',
    category: 'mice',
    brand: 'corsair',
    price: 129.99,
    description: 'Châssis aluminium, sniper button et polling 2000 Hz.'
  },

  {
    name: '990 PRO NVMe 2 To',
    category: 'storage',
    brand: 'samsung',
    price: 189.99,
    featured: true,
    description: 'SSD PCIe 4.0 jusqu’à 7 450 Mo/s. Idéal pour le jeu et la vidéo 8K.'
  },
  {
    name: 'KC3000 NVMe 1 To',
    category: 'storage',
    brand: 'kingston',
    price: 99.0,
    description: 'PCIe 4.0 hautes performances à prix maîtrisé.'
  },
  {
    name: '980 PRO NVMe 1 To',
    category: 'storage',
    brand: 'samsung',
    price: 119.99,
    description: 'La valeur sûre du stockage rapide, 7 000 Mo/s.'
  },

  {
    name: 'Fury Beast DDR5 32 Go 6000 MHz',
    category: 'memory',
    brand: 'kingston',
    price: 129.99,
    featured: true,
    description: 'Kit 2x16 Go DDR5 optimisé AMD EXPO et Intel XMP 3.0.'
  },
  {
    name: 'Vengeance RGB DDR5 32 Go 6400 MHz',
    category: 'memory',
    brand: 'corsair',
    price: 154.0,
    description: 'Éclairage RGB adressable et dissipateur aluminium.'
  },
  {
    name: 'Fury Renegade DDR5 64 Go 6000 MHz',
    category: 'memory',
    brand: 'kingston',
    price: 259.99,
    description: 'Kit 2x32 Go pour les stations de travail exigeantes.'
  },

  {
    name: 'BlackShark V2 Pro',
    category: 'headsets',
    brand: 'razer',
    price: 199.99,
    featured: true,
    description: 'Sans-fil 2,4 GHz, drivers TriForce Titanium 50 mm, micro détachable.'
  },
  {
    name: 'HS80 RGB Wireless',
    category: 'headsets',
    brand: 'corsair',
    price: 149.0,
    description: 'Audio spatial Dolby Atmos et micro broadcast.'
  },
  {
    name: 'G Pro X 2 LIGHTSPEED',
    category: 'headsets',
    brand: 'logitech',
    price: 249.0,
    description: 'Drivers en graphène 50 mm, triple connectivité.'
  }
]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const DEMO_PRODUCTS: DemoProduct[] = SEED.map((s, i) => {
  const slug = slugify(s.name)
  return {
    name: s.name,
    slug,
    description: s.description,
    price: s.price,
    stock: 8 + ((i * 7) % 40),
    // Official product shot stored under apps/web/public/products/. The UI
    // falls back to a branded tile if a file is missing.
    imageUrl: `/products/${slug}.jpg`,
    rating: Number((4.3 + ((i * 13) % 7) / 10).toFixed(1)),
    featured: Boolean(s.featured),
    categorySlug: s.category,
    brandSlug: s.brand
  }
})

export const DEMO_USERS = [
  {
    login: 'demo',
    email: 'demo@epihardware.dev',
    firstName: 'Alex',
    lastName: 'Martin',
    role: 'USER' as const,
    password: 'password'
  },
  {
    login: 'admin',
    email: 'admin@epihardware.dev',
    firstName: 'Sam',
    lastName: 'Durand',
    role: 'ADMIN' as const,
    password: 'password'
  }
]
