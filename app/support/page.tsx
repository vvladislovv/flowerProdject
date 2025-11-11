'use client'

import Button from '@/components/Button'
import Header from '@/components/Header'
import { FiMail, FiMessageCircle, FiPhone } from 'react-icons/fi'

export default function SupportPage() {
  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Поддержка" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4 w-full overflow-x-hidden">
        <div className="glass-card p-6 text-center animate-scale-in">
          <FiMessageCircle className="w-12 h-12 text-primary-green mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900">Нужна помощь?</h2>
          <p className="text-gray-900 mb-6">
            Мы здесь, чтобы помочь! Свяжитесь с нами через любой из каналов ниже.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = 'tel:+1234567890'}
              fullWidth
              variant="outline"
              className="animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center justify-center gap-2">
                <FiPhone className="w-5 h-5" />
                Позвонить нам
              </div>
            </Button>

            <Button
              onClick={() => window.location.href = 'mailto:support@flowers.com'}
              fullWidth
              variant="outline"
              className="animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex items-center justify-center gap-2">
                <FiMail className="w-5 h-5" />
                Написать нам
              </div>
            </Button>

            <Button
              onClick={() => window.location.href = '/chat'}
              fullWidth
              className="animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center justify-center gap-2">
                <FiMessageCircle className="w-5 h-5" />
                Онлайн чат
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

