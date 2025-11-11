export interface User {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  occasion?: string[]
  flowers?: string[]
  rating: number
  reviewsCount: number
  description: string
  seller?: string
  size?: string
}

export interface CartItem {
  product: Product
  quantity: number
  customMessage?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryDate: string
  deliveryTime: string
  billing: BillingInfo
  payment: PaymentInfo
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'
  createdAt: string
  cardMessage?: string
}

export interface BillingInfo {
  fullName: string
  email: string
  phone: string
  country: string
  state: string
  address: string
  postalCode: string
}

export interface PaymentInfo {
  method: string
  cardName: string
  cardNumber: string
  expirationDate: string
  securityCode: string
  saveCard?: boolean
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  text: string
  date: string
  verified?: boolean
}

export interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  occasion?: string
  flowers?: string[]
  minRating?: number
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'florist'
  text: string
  timestamp: string
}

