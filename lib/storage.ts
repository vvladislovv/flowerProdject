import { User, CartItem, Order, Product, Review } from './types'

const STORAGE_KEYS = {
  USER: 'flowers_user',
  CART: 'flowers_cart',
  ORDERS: 'flowers_orders',
  WISHLIST: 'flowers_wishlist',
  PRODUCTS: 'flowers_products',
  REVIEWS: 'flowers_reviews',
}

export const storage = {
  // User
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  },

  setUser: (user: User | null): void => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  },

  // Cart
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.CART)
    return data ? JSON.parse(data) : []
  },

  setCart: (cart: CartItem[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
  },

  addToCart: (item: CartItem): void => {
    const cart = storage.getCart()
    const existingIndex = cart.findIndex(
      (i) => i.product.id === item.product.id
    )
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity
    } else {
      cart.push(item)
    }
    storage.setCart(cart)
  },

  removeFromCart: (productId: string): void => {
    const cart = storage.getCart()
    const filtered = cart.filter((item) => item.product.id !== productId)
    storage.setCart(filtered)
  },

  updateCartItemQuantity: (productId: string, quantity: number): void => {
    const cart = storage.getCart()
    const item = cart.find((i) => i.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        storage.removeFromCart(productId)
      } else {
        item.quantity = quantity
        storage.setCart(cart)
      }
    }
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.CART)
  },

  // Orders
  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
    return data ? JSON.parse(data) : []
  },

  addOrder: (order: Order): void => {
    const orders = storage.getOrders()
    orders.unshift(order)
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  },

  // Wishlist
  getWishlist: (): string[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST)
    return data ? JSON.parse(data) : []
  },

  toggleWishlist: (productId: string): void => {
    const wishlist = storage.getWishlist()
    const index = wishlist.indexOf(productId)
    if (index >= 0) {
      wishlist.splice(index, 1)
    } else {
      wishlist.push(productId)
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist))
  },

  // Products (mock data)
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    if (data) return JSON.parse(data)
    
    // Initialize with mock data
    const mockProducts: Product[] = [
      // Bouquets
      {
        id: '1',
        name: 'Potatoes Flower',
        price: 86,
        image: '🌼',
        category: 'Bouquets',
        occasion: ['Birthday', 'Anniversary'],
        flowers: ['Roses', 'Lilies'],
        rating: 4.9,
        reviewsCount: 15,
        description: 'Beautiful white flowers arranged in an elegant bouquet.',
        seller: 'Jacob Doe Florist',
        size: 'Medium',
      },
      {
        id: '5',
        name: 'Blue White Bouquets',
        price: 90,
        image: '💐',
        category: 'Bouquets',
        occasion: ['Wedding', 'Anniversary'],
        flowers: ['Tulips', 'Hyacinths'],
        rating: 4.9,
        reviewsCount: 107,
        description: 'Elegant blue and white bouquet perfect for special occasions.',
        seller: 'Jacob Doe Florist',
        size: 'Boutique',
      },
      {
        id: '6',
        name: 'Royal Pink Bouquets',
        price: 95,
        image: '🌹',
        category: 'Bouquets',
        occasion: ['Valentine', 'Anniversary'],
        flowers: ['Roses', 'Peonies'],
        rating: 4.8,
        reviewsCount: 84,
        description: 'Romantic pink bouquet with premium roses.',
        seller: 'Rainbow Rose Florals',
        size: 'Boutique',
      },
      {
        id: '7',
        name: 'Sunset Bouquet',
        price: 110,
        image: '🌺',
        category: 'Bouquets',
        occasion: ['Birthday', 'Graduation'],
        flowers: ['Sunflowers', 'Daisies'],
        rating: 4.7,
        reviewsCount: 52,
        description: 'Bright and cheerful bouquet with sunflowers and daisies.',
        seller: 'Lily Lane Florals',
        size: 'Large',
      },
      // Indoor Plants
      {
        id: '2',
        name: 'Tagetes Flower',
        price: 126,
        image: '🌻',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Marigolds'],
        rating: 4.8,
        reviewsCount: 20,
        description: 'Vibrant orange flowers in a decorative pot.',
        seller: 'Rainbow Rose Florals',
        size: 'Large',
      },
      {
        id: '3',
        name: 'Bloming Flower',
        price: 246,
        image: '🌺',
        category: 'Indoor',
        occasion: ['Anniversary', 'Valentine'],
        flowers: ['Roses', 'Peonies'],
        rating: 4.9,
        reviewsCount: 25,
        description: 'Elegant potted plant with dark leaves and pink flowers.',
        seller: 'Lily Lane Florals',
        size: 'Large',
      },
      {
        id: '4',
        name: 'Spring Flower',
        price: 286,
        image: '🌷',
        category: 'Indoor',
        occasion: ['Housewarming', 'Birthday'],
        flowers: ['Tulips', 'Daffodils'],
        rating: 4.7,
        reviewsCount: 18,
        description: 'Fresh spring flowers in a beautiful arrangement.',
        seller: 'Jacob Doe Florist',
        size: 'Medium',
      },
      {
        id: '8',
        name: 'Lavender Plant',
        price: 45,
        image: '🌿',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Lavender'],
        rating: 4.6,
        reviewsCount: 33,
        description: 'Fragrant lavender plant perfect for home decoration.',
        seller: 'Rainbow Rose Florals',
        size: 'Small',
      },
      // Vases
      {
        id: '9',
        name: 'Crystal Glass Vase',
        price: 65,
        image: '🏺',
        category: 'Accessories',
        occasion: ['Wedding', 'Anniversary'],
        rating: 4.8,
        reviewsCount: 42,
        description: 'Elegant crystal glass vase for your beautiful flowers.',
        seller: 'Jacob Doe Florist',
        size: 'Medium',
      },
      {
        id: '10',
        name: 'Ceramic Vase Set',
        price: 85,
        image: '🫖',
        category: 'Accessories',
        occasion: ['Housewarming', 'Birthday'],
        rating: 4.7,
        reviewsCount: 28,
        description: 'Set of 3 beautiful ceramic vases in different sizes.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
      {
        id: '11',
        name: 'Modern Metal Vase',
        price: 55,
        image: '⚱️',
        category: 'Accessories',
        occasion: ['Housewarming'],
        rating: 4.9,
        reviewsCount: 19,
        description: 'Sleek modern metal vase with geometric design.',
        seller: 'Rainbow Rose Florals',
        size: 'Large',
      },
      // Gift Cards & Messages
      {
        id: '12',
        name: 'Premium Gift Card',
        price: 100,
        image: '💳',
        category: 'Gifts',
        occasion: ['Birthday', 'Anniversary', 'Valentine'],
        rating: 5.0,
        reviewsCount: 156,
        description: 'Gift card that can be used for any purchase in our store.',
        seller: 'Flower Shop',
        size: 'Standard',
      },
      {
        id: '13',
        name: 'Handwritten Card',
        price: 8,
        image: '💌',
        category: 'Gifts',
        occasion: ['Birthday', 'Anniversary', 'Valentine'],
        rating: 4.9,
        reviewsCount: 89,
        description: 'Beautiful handwritten greeting card with your message.',
        seller: 'Jacob Doe Florist',
        size: 'Standard',
      },
      {
        id: '14',
        name: 'Gift Box Set',
        price: 25,
        image: '🎁',
        category: 'Gifts',
        occasion: ['Birthday', 'Anniversary'],
        rating: 4.8,
        reviewsCount: 67,
        description: 'Elegant gift box with ribbon and card included.',
        seller: 'Lily Lane Florals',
        size: 'Standard',
      },
      // Chocolates & Sweets
      {
        id: '15',
        name: 'Premium Chocolate Box',
        price: 35,
        image: '🍫',
        category: 'Gifts',
        occasion: ['Valentine', 'Birthday', 'Anniversary'],
        rating: 4.9,
        reviewsCount: 124,
        description: 'Luxury chocolate box with assorted flavors.',
        seller: 'Rainbow Rose Florals',
        size: 'Medium',
      },
      {
        id: '16',
        name: 'Honey Gift Set',
        price: 28,
        image: '🍯',
        category: 'Gifts',
        occasion: ['Housewarming', 'Birthday'],
        rating: 4.7,
        reviewsCount: 45,
        description: 'Natural honey gift set with beautiful packaging.',
        seller: 'Jacob Doe Florist',
        size: 'Small',
      },
      // Decorative Items
      {
        id: '17',
        name: 'Ribbon & Bow Set',
        price: 12,
        image: '🎀',
        category: 'Accessories',
        occasion: ['Wedding', 'Birthday'],
        rating: 4.6,
        reviewsCount: 38,
        description: 'Colorful ribbon and bow set for gift wrapping.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
      {
        id: '18',
        name: 'Decorative Candle Set',
        price: 32,
        image: '🕯️',
        category: 'Accessories',
        occasion: ['Housewarming', 'Anniversary'],
        rating: 4.8,
        reviewsCount: 71,
        description: 'Elegant scented candles in decorative holders.',
        seller: 'Rainbow Rose Florals',
        size: 'Set',
      },
      {
        id: '19',
        name: 'Flower Preservative',
        price: 15,
        image: '🧪',
        category: 'Accessories',
        occasion: [],
        rating: 4.9,
        reviewsCount: 203,
        description: 'Special preservative to keep your flowers fresh longer.',
        seller: 'Jacob Doe Florist',
        size: 'Standard',
      },
      // Soft Toys
      {
        id: '20',
        name: 'Teddy Bear with Flowers',
        price: 45,
        image: '🧸',
        category: 'Gifts',
        occasion: ['Valentine', 'Birthday'],
        rating: 4.8,
        reviewsCount: 92,
        description: 'Adorable teddy bear holding a small flower bouquet.',
        seller: 'Lily Lane Florals',
        size: 'Medium',
      },
      // More Bouquets
      {
        id: '21',
        name: 'White Elegance',
        price: 120,
        image: '🤍',
        category: 'Bouquets',
        occasion: ['Wedding', 'Funeral'],
        flowers: ['White Roses', 'Lilies'],
        rating: 4.9,
        reviewsCount: 78,
        description: 'Pure white elegant bouquet for special occasions.',
        seller: 'Jacob Doe Florist',
        size: 'Large',
      },
      {
        id: '22',
        name: 'Rainbow Mix',
        price: 105,
        image: '🌈',
        category: 'Bouquets',
        occasion: ['Birthday', 'Graduation'],
        flowers: ['Mixed Seasonal'],
        rating: 4.7,
        reviewsCount: 56,
        description: 'Colorful mix of seasonal flowers in vibrant colors.',
        seller: 'Rainbow Rose Florals',
        size: 'Medium',
      },
      // More Bouquets
      {
        id: '23',
        name: 'Red Rose Bouquet',
        price: 125,
        image: '🌹',
        category: 'Bouquets',
        occasion: ['Valentine', 'Anniversary'],
        flowers: ['Red Roses'],
        rating: 4.9,
        reviewsCount: 203,
        description: 'Classic red roses bouquet, perfect for expressing love.',
        seller: 'Jacob Doe Florist',
        size: 'Large',
      },
      {
        id: '24',
        name: 'Lily Bouquet',
        price: 98,
        image: '🌺',
        category: 'Bouquets',
        occasion: ['Wedding', 'Anniversary'],
        flowers: ['Lilies', 'Baby Breath'],
        rating: 4.8,
        reviewsCount: 91,
        description: 'Elegant white lilies with baby breath accents.',
        seller: 'Lily Lane Florals',
        size: 'Medium',
      },
      {
        id: '25',
        name: 'Tulip Spring Mix',
        price: 75,
        image: '🌷',
        category: 'Bouquets',
        occasion: ['Birthday', 'Housewarming'],
        flowers: ['Tulips'],
        rating: 4.7,
        reviewsCount: 64,
        description: 'Fresh spring tulips in various colors.',
        seller: 'Rainbow Rose Florals',
        size: 'Medium',
      },
      // More Indoor Plants
      {
        id: '26',
        name: 'Succulent Garden',
        price: 35,
        image: '🌵',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Succulents'],
        rating: 4.8,
        reviewsCount: 127,
        description: 'Beautiful succulent arrangement in decorative pot.',
        seller: 'Lily Lane Florals',
        size: 'Small',
      },
      {
        id: '27',
        name: 'Orchid Plant',
        price: 68,
        image: '🪷',
        category: 'Indoor',
        occasion: ['Anniversary', 'Housewarming'],
        flowers: ['Orchids'],
        rating: 4.9,
        reviewsCount: 88,
        description: 'Elegant orchid plant in ceramic pot.',
        seller: 'Jacob Doe Florist',
        size: 'Medium',
      },
      {
        id: '28',
        name: 'Bamboo Plant',
        price: 42,
        image: '🎋',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Bamboo'],
        rating: 4.6,
        reviewsCount: 45,
        description: 'Lucky bamboo plant for good fortune.',
        seller: 'Rainbow Rose Florals',
        size: 'Medium',
      },
      // More Accessories
      {
        id: '29',
        name: 'Floral Arrangement Kit',
        price: 45,
        image: '🧰',
        category: 'Accessories',
        occasion: ['Birthday'],
        rating: 4.7,
        reviewsCount: 56,
        description: 'Complete kit for creating your own arrangements.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
      {
        id: '30',
        name: 'Watering Can',
        price: 28,
        image: '🚿',
        category: 'Accessories',
        occasion: [],
        rating: 4.8,
        reviewsCount: 73,
        description: 'Decorative watering can for your plants.',
        seller: 'Jacob Doe Florist',
        size: 'Standard',
      },
      {
        id: '31',
        name: 'Plant Stand',
        price: 55,
        image: '🪑',
        category: 'Accessories',
        occasion: ['Housewarming'],
        rating: 4.6,
        reviewsCount: 39,
        description: 'Modern plant stand for indoor plants.',
        seller: 'Rainbow Rose Florals',
        size: 'Large',
      },
      // More Gifts
      {
        id: '32',
        name: 'Flower Pot Set',
        price: 38,
        image: '🪴',
        category: 'Gifts',
        occasion: ['Housewarming', 'Birthday'],
        rating: 4.8,
        reviewsCount: 102,
        description: 'Set of 3 decorative flower pots.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
      {
        id: '33',
        name: 'Floral Scented Candle',
        price: 22,
        image: '🕯️',
        category: 'Gifts',
        occasion: ['Anniversary', 'Birthday'],
        rating: 4.9,
        reviewsCount: 145,
        description: 'Luxury floral scented candle.',
        seller: 'Rainbow Rose Florals',
        size: 'Standard',
      },
      {
        id: '34',
        name: 'Gift Wrapping Service',
        price: 15,
        image: '🎀',
        category: 'Gifts',
        occasion: ['Birthday', 'Anniversary', 'Valentine'],
        rating: 5.0,
        reviewsCount: 234,
        description: 'Professional gift wrapping with ribbon and card.',
        seller: 'Jacob Doe Florist',
        size: 'Standard',
      },
      // New Products
      {
        id: '35',
        name: 'Cherry Blossom Bouquet',
        price: 115,
        image: '🌸',
        category: 'Bouquets',
        occasion: ['Spring', 'Anniversary', 'Birthday'],
        flowers: ['Cherry Blossoms'],
        rating: 4.9,
        reviewsCount: 67,
        description: 'Delicate cherry blossom bouquet perfect for spring celebrations.',
        seller: 'Rainbow Rose Florals',
        size: 'Medium',
      },
      {
        id: '36',
        name: 'Sunflower Field',
        price: 88,
        image: '🌻',
        category: 'Bouquets',
        occasion: ['Birthday', 'Graduation', 'Housewarming'],
        flowers: ['Sunflowers'],
        rating: 4.8,
        reviewsCount: 94,
        description: 'Bright and cheerful sunflower arrangement.',
        seller: 'Lily Lane Florals',
        size: 'Large',
      },
      {
        id: '37',
        name: 'Lotus Flower Arrangement',
        price: 125,
        image: '🪷',
        category: 'Bouquets',
        occasion: ['Wedding', 'Anniversary'],
        flowers: ['Lotus'],
        rating: 4.9,
        reviewsCount: 43,
        description: 'Elegant lotus flower arrangement for special occasions.',
        seller: 'Jacob Doe Florist',
        size: 'Large',
      },
      {
        id: '38',
        name: 'Cactus Collection',
        price: 48,
        image: '🌵',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Cacti'],
        rating: 4.7,
        reviewsCount: 156,
        description: 'Beautiful collection of decorative cacti in modern pots.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
      {
        id: '39',
        name: 'Potted Plant',
        price: 38,
        image: '🪴',
        category: 'Indoor',
        occasion: ['Housewarming', 'Birthday'],
        flowers: ['House Plants'],
        rating: 4.8,
        reviewsCount: 112,
        description: 'Healthy potted plant perfect for home decoration.',
        seller: 'Rainbow Rose Florals',
        size: 'Medium',
      },
      {
        id: '40',
        name: 'Bamboo Lucky Plant',
        price: 42,
        image: '🎋',
        category: 'Indoor',
        occasion: ['Housewarming', 'New Year'],
        flowers: ['Bamboo'],
        rating: 4.6,
        reviewsCount: 89,
        description: 'Traditional lucky bamboo plant for good fortune.',
        seller: 'Jacob Doe Florist',
        size: 'Medium',
      },
      {
        id: '41',
        name: 'Herb Garden Set',
        price: 55,
        image: '🌿',
        category: 'Indoor',
        occasion: ['Housewarming', 'Birthday'],
        flowers: ['Herbs'],
        rating: 4.9,
        reviewsCount: 134,
        description: 'Fresh herb garden set with basil, mint, and rosemary.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
      {
        id: '42',
        name: 'Floral Perfume Set',
        price: 65,
        image: '🌺',
        category: 'Gifts',
        occasion: ['Valentine', 'Anniversary', 'Birthday'],
        rating: 4.8,
        reviewsCount: 178,
        description: 'Luxury floral perfume set with three fragrances.',
        seller: 'Rainbow Rose Florals',
        size: 'Set',
      },
      {
        id: '43',
        name: 'Rose Petal Bath Set',
        price: 45,
        image: '🌹',
        category: 'Gifts',
        occasion: ['Valentine', 'Anniversary'],
        rating: 4.9,
        reviewsCount: 201,
        description: 'Luxurious rose petal bath set for relaxation.',
        seller: 'Jacob Doe Florist',
        size: 'Set',
      },
      {
        id: '44',
        name: 'Floral Tea Collection',
        price: 32,
        image: '🫖',
        category: 'Gifts',
        occasion: ['Birthday', 'Housewarming'],
        rating: 4.7,
        reviewsCount: 98,
        description: 'Premium floral tea collection with various flavors.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
      {
        id: '45',
        name: 'Garden Tools Set',
        price: 75,
        image: '🧰',
        category: 'Accessories',
        occasion: ['Housewarming', 'Birthday'],
        rating: 4.8,
        reviewsCount: 76,
        description: 'Complete garden tools set for plant care.',
        seller: 'Rainbow Rose Florals',
        size: 'Set',
      },
      {
        id: '46',
        name: 'Decorative Plant Hanger',
        price: 28,
        image: '🪑',
        category: 'Accessories',
        occasion: ['Housewarming'],
        rating: 4.6,
        reviewsCount: 54,
        description: 'Modern decorative plant hanger for indoor plants.',
        seller: 'Jacob Doe Florist',
        size: 'Standard',
      },
      {
        id: '47',
        name: 'Floral Scented Diffuser',
        price: 38,
        image: '🕯️',
        category: 'Accessories',
        occasion: ['Housewarming', 'Anniversary'],
        rating: 4.9,
        reviewsCount: 167,
        description: 'Elegant floral scented diffuser for home ambiance.',
        seller: 'Lily Lane Florals',
        size: 'Standard',
      },
      {
        id: '48',
        name: 'White Heart Bouquet',
        price: 105,
        image: '🤍',
        category: 'Bouquets',
        occasion: ['Wedding', 'Anniversary', 'Valentine'],
        flowers: ['White Roses', 'Baby Breath'],
        rating: 4.9,
        reviewsCount: 145,
        description: 'Pure white heart-shaped bouquet for special moments.',
        seller: 'Rainbow Rose Florals',
        size: 'Medium',
      },
      {
        id: '49',
        name: 'Rainbow Mixed Bouquet',
        price: 95,
        image: '🌈',
        category: 'Bouquets',
        occasion: ['Birthday', 'Graduation', 'Celebration'],
        flowers: ['Mixed Seasonal'],
        rating: 4.8,
        reviewsCount: 123,
        description: 'Vibrant rainbow mix of colorful seasonal flowers.',
        seller: 'Jacob Doe Florist',
        size: 'Large',
      },
      {
        id: '50',
        name: 'Premium Flower Seeds',
        price: 18,
        image: '🌱',
        category: 'Gifts',
        occasion: ['Housewarming', 'Birthday'],
        rating: 4.7,
        reviewsCount: 87,
        description: 'Premium flower seeds collection for gardening enthusiasts.',
        seller: 'Lily Lane Florals',
        size: 'Set',
      },
    ]
    
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts))
    return mockProducts
  },

  // Reviews
  getReviews: (productId?: string): Review[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS)
    const reviews: Review[] = data ? JSON.parse(data) : []
    return productId ? reviews.filter((r) => r.productId === productId) : reviews
  },

  addReview: (review: Review): void => {
    const reviews = storage.getReviews()
    reviews.unshift(review)
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))
  },
}

