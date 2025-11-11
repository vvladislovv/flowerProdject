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
                ? 'glass bg-primary-green/80 text-white border border-primary-green/50 shadow-lg'
                : 'glass-button text-gray-900 border border-white/30 hover:bg-white/70'
            }`}
          >
            Товары
          </button>
          <button
            onClick={() => setActiveTab('florists')}
            className={`flex-1 py-2 font-medium transition-all duration-200 ${
              activeTab === 'florists'
                ? 'glass bg-primary-green/80 text-white border border-primary-green/50 shadow-lg'
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
            {/* Mock florists */}
            <div className="glass-card p-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0">
                  <EmojiImage emoji="🌺" size="md" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Rainbow Rose Florals</h3>
                  <p className="text-sm text-gray-900">Иван Петров</p>
                  <p className="text-xs text-gray-900 mb-2">Москва, Россия</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs text-gray-900">4.8</span>
                  </div>
                  <p className="text-sm text-primary-green font-semibold">
                    1500 ₽ - 12000 ₽
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

