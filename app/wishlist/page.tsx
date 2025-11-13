'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { storage } from '@/lib/storage'
import { Product } from '@/lib/types'
import EmojiImage from '@/components/EmojiImage'

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<'products' | 'florists'>('products')

  const florists = [
    {
      id: '1',
      name: 'Радужные Розы',
      floristName: 'Иван Петров',
      location: 'Москва, Россия',
      rating: 4.8,
      reviews: 156,
      priceRange: '1500 ₽ - 12000 ₽',
      emoji: '🌺',
    },
    {
      id: '2',
      name: 'Флорист Яков',
      floristName: 'Яков Смирнов',
      location: 'Санкт-Петербург, Россия',
      rating: 4.9,
      reviews: 234,
      priceRange: '2000 ₽ - 15000 ₽',
      emoji: '🌹',
    },
    {
      id: '3',
      name: 'Лилейная Аллея',
      floristName: 'Мария Иванова',
      location: 'Новосибирск, Россия',
      rating: 4.7,
      reviews: 189,
      priceRange: '1200 ₽ - 10000 ₽',
      emoji: '🌷',
    },
    {
      id: '4',
      name: 'Цветочный Магазин',
      floristName: 'Александр Козлов',
      location: 'Екатеринбург, Россия',
      rating: 4.8,
      reviews: 278,
      priceRange: '1800 ₽ - 13000 ₽',
      emoji: '💐',
    },
    {
      id: '5',
      name: 'Розовый Сад',
      floristName: 'Елена Волкова',
      location: 'Казань, Россия',
      rating: 4.9,
      reviews: 145,
      priceRange: '1600 ₽ - 11000 ₽',
      emoji: '🌸',
    },
    {
      id: '6',
      name: 'Весенние Цветы',
      floristName: 'Дмитрий Новиков',
      location: 'Нижний Новгород, Россия',
      rating: 4.6,
      reviews: 98,
      priceRange: '1000 ₽ - 8000 ₽',
      emoji: '🌼',
    },
    {
      id: '7',
      name: 'Элегант Флора',
      floristName: 'Анна Соколова',
      location: 'Челябинск, Россия',
      rating: 4.8,
      reviews: 167,
      priceRange: '1400 ₽ - 9500 ₽',
      emoji: '🌻',
    },
    {
      id: '8',
      name: 'Букетная Мастерская',
      floristName: 'Сергей Лебедев',
      location: 'Самара, Россия',
      rating: 4.7,
      reviews: 201,
      priceRange: '1300 ₽ - 9000 ₽',
      emoji: '🌿',
    },
    {
      id: '9',
      name: 'Цветочная Сказка',
      floristName: 'Ольга Морозова',
      location: 'Омск, Россия',
      rating: 4.9,
      reviews: 132,
      priceRange: '1700 ₽ - 12000 ₽',
      emoji: '🪷',
    },
    {
      id: '10',
      name: 'Райский Сад',
      floristName: 'Владимир Орлов',
      location: 'Ростов-на-Дону, Россия',
      rating: 4.8,
      reviews: 223,
      priceRange: '1500 ₽ - 11000 ₽',
      emoji: '🌺',
    },
  ]

  useEffect(() => {
    const ids = storage.getWishlist()
    setWishlistIds(ids)

    const allProducts = storage.getProducts()
    const wishlistProducts = allProducts.filter((p) => ids.includes(p.id))
    setProducts(wishlistProducts)
  }, [])

  const handleToggleWishlist = (productId: string) => {
    storage.toggleWishlist(productId)
    const ids = storage.getWishlist()
    setWishlistIds(ids)
    const allProducts = storage.getProducts()
    const wishlistProducts = allProducts.filter((p) => ids.includes(p.id))
    setProducts(wishlistProducts)
  }

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Мое избранное" showBack showCart />
      
      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 font-medium transition-all duration-200 ${
              activeTab === 'products'
                ? 'glass bg-white/90 text-gray-900 border border-gray-300 shadow-lg font-semibold'
                : 'glass-button text-gray-900 border border-white/30 hover:bg-white/70'
            }`}
          >
            Товары
          </button>
          <button
            onClick={() => setActiveTab('florists')}
            className={`flex-1 py-2 font-medium transition-all duration-200 ${
              activeTab === 'florists'
                ? 'glass bg-white/90 text-gray-900 border border-gray-300 shadow-lg font-semibold'
                : 'glass-button text-gray-900 border border-white/30 hover:bg-white/70'
            }`}
          >
            Флористы
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-12 glass-card p-8 animate-fade-in">
                <p className="text-gray-900">Ваш список избранного пуст</p>
              </div>
            ) : (
              products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 flex animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 border-r border-white/30 overflow-hidden">
                    <EmojiImage emoji={product.image} size="md" className="w-full h-full" />
                  </div>
                  <div className="p-4 flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold truncate flex-1 min-w-0">{product.name}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleWishlist(product.id)
                        }}
                        className="text-red-500 hover:text-red-600 flex-shrink-0 ml-2"
                      >
                        ♥
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs text-gray-900">{product.rating}</span>
                    </div>
                    <p className="text-primary-green font-bold truncate">{product.price} ₽</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {florists.map((florist, index) => (
              <div key={florist.id} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0 rounded-full">
                    <EmojiImage emoji={florist.emoji} size="md" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{florist.name}</h3>
                    <p className="text-sm text-gray-900">{florist.floristName}</p>
                    <p className="text-xs text-gray-900 mb-2">{florist.location}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs text-gray-900">{florist.rating}</span>
                      <span className="text-xs text-gray-900 ml-1">({florist.reviews} отзывов)</span>
                    </div>
                    <p className="text-sm text-primary-green font-semibold">
                      {florist.priceRange}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

