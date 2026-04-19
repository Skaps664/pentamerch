export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  images?: string[];
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Latest gadgets and devices"
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1525261741207-4b6f9a891e11?w=400&h=400&fit=crop",
    description: "Trending clothing and accessories"
  },
  {
    id: "home",
    name: "Home & Living",
    slug: "home",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    description: "Furniture and home essentials"
  },
  {
    id: "beauty",
    name: "Beauty & Care",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=400&fit=crop",
    description: "Skincare and beauty products"
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    slug: "sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25ddfcb70ff?w=400&h=400&fit=crop",
    description: "Sports equipment and fitness gear"
  },
  {
    id: "books",
    name: "Books & Media",
    slug: "books",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop",
    description: "Books, ebooks, and media"
  }
];

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 2543,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Impedance": "32 Ohm",
      "Battery Life": "30 hours"
    }
  },
  {
    id: "2",
    name: "Ultra-Thin Laptop",
    price: 1299.99,
    originalPrice: 1599.99,
    description: "Lightweight laptop with powerful processor and stunning display",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 1823,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1588872657840-790ff3bde1b6?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Processor": "Intel Core i7",
      "RAM": "16GB DDR5",
      "Storage": "512GB SSD",
      "Display": "15.6\" 4K"
    }
  },
  {
    id: "3",
    name: "Designer Casual Blazer",
    price: 189.99,
    originalPrice: 299.99,
    description: "Elegant blazer perfect for office or casual wear",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1591028171603-e14f2c4d2bef?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 892,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1591028171603-e14f2c4d2bef?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Material": "100% Wool",
      "Sizes": "XS - XXL",
      "Colors": "Black, Navy, Charcoal"
    }
  },
  {
    id: "4",
    name: "Premium Skincare Set",
    price: 129.99,
    originalPrice: 179.99,
    description: "Complete skincare routine with natural ingredients",
    category: "beauty",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 3421,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Items": "5 pieces",
      "Type": "Anti-aging",
      "Skin Type": "All types"
    }
  },
  {
    id: "5",
    name: "Minimalist Coffee Table",
    price: 449.99,
    originalPrice: 599.99,
    description: "Modern wooden coffee table with clean lines",
    category: "home",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 654,
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Material": "Walnut Wood",
      "Dimensions": "120cm x 60cm x 45cm",
      "Weight Capacity": "50kg"
    }
  },
  {
    id: "6",
    name: "Professional Camera",
    price: 899.99,
    originalPrice: 1199.99,
    description: "High-resolution DSLR camera for professionals",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 1234,
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Megapixels": "42MP",
      "Sensor": "Full Frame",
      "Video": "4K 60fps"
    }
  },
  {
    id: "7",
    name: "Yoga Mat Premium",
    price: 59.99,
    originalPrice: 79.99,
    description: "Non-slip yoga mat with extra cushioning",
    category: "sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 1523,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Thickness": "6mm",
      "Material": "TPE",
      "Length": "183cm"
    }
  },
  {
    id: "8",
    name: "Bestselling Novel Collection",
    price: 39.99,
    originalPrice: 59.99,
    description: "Collection of top-rated bestselling novels",
    category: "books",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 2341,
    inStock: true,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Format": "Hardcover",
      "Books": "3",
      "Pages": "1200+"
    }
  },
  {
    id: "9",
    name: "Premium Watch",
    price: 349.99,
    originalPrice: 499.99,
    description: "Elegant stainless steel watch with automatic movement",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 987,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Material": "Stainless Steel",
      "Movement": "Automatic",
      "Water Resistance": "100m"
    }
  },
  {
    id: "10",
    name: "Smart Home Hub",
    price: 129.99,
    originalPrice: 179.99,
    description: "Control all your smart devices with one hub",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 1654,
    inStock: true,
    isFeatured: false,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Compatibility": "All Major Brands",
      "Connectivity": "WiFi 6",
      "Power": "USB-C"
    }
  },
  {
    id: "11",
    name: "Fitness Smartwatch",
    price: 199.99,
    originalPrice: 299.99,
    description: "Track your fitness goals with advanced sensors",
    category: "sports",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 2156,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Display": "AMOLED",
      "Battery": "14 days",
      "Features": "Heart Rate, GPS, Sleep"
    }
  },
  {
    id: "12",
    name: "Luxury Perfume",
    price: 149.99,
    originalPrice: 199.99,
    description: "Premium fragrance with exotic notes",
    category: "beauty",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 876,
    inStock: true,
    isFeatured: false,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Volume": "100ml",
      "Type": "Eau de Parfum",
      "Notes": "Top, Heart, Base"
    }
  },
  {
    id: "13",
    name: "Comfortable Office Chair",
    price: 399.99,
    originalPrice: 549.99,
    description: "Ergonomic office chair with lumbar support",
    category: "home",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 1432,
    inStock: true,
    isFeatured: false,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Material": "Mesh & Leather",
      "Recline": "120°",
      "Height Adjustment": "Yes"
    }
  },
  {
    id: "14",
    name: "4K External Monitor",
    price: 549.99,
    originalPrice: 749.99,
    description: "Stunning 4K display for professionals",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 1087,
    inStock: true,
    isFeatured: true,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Size": "32 inch",
      "Resolution": "4K",
      "Refresh Rate": "60Hz"
    }
  },
  {
    id: "15",
    name: "Running Shoes",
    price: 139.99,
    originalPrice: 179.99,
    description: "Lightweight running shoes with excellent cushioning",
    category: "sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 2876,
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    ],
    specifications: {
      "Material": "Mesh & Synthetic",
      "Weight": "250g",
      "Sizes": "5-13"
    }
  }
];

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured);
}

export function getBestsellerProducts(): Product[] {
  return products.filter(p => p.isBestseller);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.category === categoryId);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}
