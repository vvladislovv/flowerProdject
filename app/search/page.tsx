'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { FiSearch, FiX } from 'react-icons/fi'
import { storage } from '@/lib/storage'
import { Product } from '@/lib/types'
import EmojiImage from '@/components/EmojiImage'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const recent = localStorage.getItem('recent_searches')
    if (recent) {
      setRecentSearches(JSON.parse(recent))
    }
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const products = storage.getProducts()
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.trim()) {
      const recent = [...recentSearches.filter((s) => s !== searchQuery), searchQuery].slice(0, 5)
      setRecentSearches(recent)
      localStorage.setItem('recent_searches', JSON.stringify(recent))
    }
  }

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header showBack showCart={false} />

      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        {/* Search Bar */}
        <div className="relative mb-4 animate-fade-in">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full pl-12 pr-10 py-3 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results */}
        {query && (
          <div className="animate-fade-in">
            <p className="text-sm text-gray-900 mb-3">
              Найдено: {results.length}
            </p>
            <div className="space-y-3">
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 flex animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 border-r border-white/30 flex-shrink-0 m-3 overflow-hidden">
                    <EmojiImage emoji={product.image} size="sm" className="w-full h-full" />
                  </div>
                  <div className="p-3 flex-1 min-w-0 overflow-hidden">
                    <h3 className="font-semibold text-sm mb-1 text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-900 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-primary-green font-bold">{product.price} ₽</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="font-semibold mb-3 text-gray-900">Недавние поиски</h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-4 py-2 glass-button hover:bg-white/70 transition-all duration-200 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!query && (
          <div className="animate-fade-in">
            <h3 className="font-semibold mb-3 text-gray-900">Популярные поиски</h3>
            <div className="flex flex-wrap gap-2">
              {['Розы', 'Букеты', 'Свадьба', 'Юбилей', 'День рождения'].map(
                (term, index) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 glass-button text-sm hover:bg-white/70 transition-all duration-200 animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

