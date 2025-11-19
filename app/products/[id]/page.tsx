'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi'
import { storage } from '@/lib/storage'
import { Product, Review } from '@/lib/types'
import EmojiImage from '@/components/EmojiImage'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!productId) return

    const products = storage.getProducts()
    const foundProduct = products.find((p) => p.id === productId)
    setProduct(foundProduct || null)

    const productReviews = storage.getReviews(productId)
    setReviews(productReviews)

    const wishlist = storage.getWishlist()
    setIsInWishlist(wishlist.includes(productId))
  }, [productId])

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Товар не найден</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    storage.addToCart({
      product,
      quantity,
    })
    router.push('/cart')
  }

  const handleToggleWishlist = () => {
    storage.toggleWishlist(product.id)
    setIsInWishlist(!isInWishlist)
  }

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden bg-white">
      <Header showBack showCart />

      <div className="max-w-md mx-auto w-full overflow-x-hidden">
        {/* Main Image */}
        <div className="relative w-full h-80 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 overflow-hidden">
          <EmojiImage emoji={product.image} size="xl" className="w-full h-full" />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-4 right-4 p-2 glass-button hover:bg-white/70 transition-all duration-200"
          >
            <FiHeart
              className={`w-5 h-5 ${
                isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        <div className="px-4 space-y-4">
          {/* Quantity Selector */}
          <div className="glass-card p-4 rounded-2xl animate-fade-in">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900">Количество:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 glass-button flex items-center justify-center hover:bg-white/70 transition-all duration-300 rounded-xl"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 glass-button flex items-center justify-center hover:bg-white/70 transition-all duration-300 rounded-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="glass-card p-4 rounded-2xl animate-slide-up">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-900 font-medium">
                {product.reviewsCount} отзывов
              </span>
            </div>
            <p className="text-2xl font-bold text-primary-green mb-4">
              {product.price} ₽
            </p>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className="glass-card p-4 rounded-2xl animate-fade-in">
              <p className="text-sm text-gray-900 mb-1">Продавец</p>
              <p className="font-semibold text-gray-900">{product.seller}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="font-semibold mb-2 text-gray-900">Детали товара</h2>
            <p className="text-gray-900 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size */}
          {product.size && (
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Размер</h3>
              <p className="text-gray-900">{product.size}</p>
            </div>
          )}

          {/* Reviews Link */}
          <Link
            href={`/products/${product.id}/reviews`}
            className="block py-3 text-center text-primary-green hover:underline"
          >
            Посмотреть все отзывы ({product.reviewsCount})
          </Link>

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/30 p-4 max-w-md mx-auto">
            <div className="flex gap-3">
              <button className="p-3 glass-button hover:bg-white/70 transition-all duration-200">
                <FiShoppingBag className="w-5 h-5" />
              </button>
              <Button onClick={handleAddToCart} fullWidth>
                Добавить в корзину
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

