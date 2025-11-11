'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { storage } from '@/lib/storage'
import { Product, Review } from '@/lib/types'
import { FiStar } from 'react-icons/fi'

export default function ReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    text: '',
  })

  useEffect(() => {
    if (!productId) return

    const products = storage.getProducts()
    const foundProduct = products.find((p) => p.id === productId)
    setProduct(foundProduct || null)

    const productReviews = storage.getReviews(productId)
    setReviews(productReviews)
  }, [productId])

  const handleSubmitReview = () => {
    if (!product || !newReview.text.trim()) return

    const review: Review = {
      id: Date.now().toString(),
      productId: product.id,
      userId: '1',
      userName: 'You',
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toISOString(),
      verified: false,
    }

    storage.addReview(review)
    const updatedReviews = storage.getReviews(productId)
    setReviews(updatedReviews)
    setShowReviewForm(false)
    setNewReview({ rating: 5, text: '' })
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Товар не найден</p>
      </div>
    )
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Отзывы" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        {/* Rating Summary */}
          <div className="glass-card p-6 mb-4 text-center animate-scale-in">
          <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-900">({reviews.length} отзывов)</p>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 mb-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <p className="text-gray-900">Пока нет отзывов</p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <div key={review.id} className="glass-card p-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.userName === 'You' ? 'Вы' : review.userName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-900">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-900 text-sm">{review.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Write Review Button */}
        <Button
          onClick={() => setShowReviewForm(true)}
          fullWidth
          variant="outline"
        >
          Написать отзыв
        </Button>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end">
            <div className="glass-dark w-full max-w-md mx-auto border-t border-white/30 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Оставить отзыв</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900">Рейтинг</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className={`w-10 h-10 rounded-full border backdrop-blur-lg flex items-center justify-center transition-all duration-200 ${
                        newReview.rating >= rating
                          ? 'bg-yellow-400/80 text-white border-yellow-400/50 shadow-lg'
                          : 'bg-white/10 border-white/30 text-gray-600'
                      }`}
                    >
                      {newReview.rating >= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Подробный отзыв
                </label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  placeholder="Введите ваш отзыв здесь"
                  className="w-full px-4 py-3 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green resize-none text-gray-900"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReviewForm(false)}
                  variant="secondary"
                  fullWidth
                >
                  Отмена
                </Button>
                <Button onClick={handleSubmitReview} fullWidth>
                  Отправить
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

