'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { FiMail, FiLock } from 'react-icons/fi'
import { storage } from '@/lib/storage'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Заполните все поля')
      return
    }

    // Mock authentication
    const user = {
      id: '1',
      name: 'Иван Иванов',
      email: email,
      phone: '+79001234567',
      location: 'Москва, Россия',
    }

    storage.setUser(user)
    router.push('/home')
  }

  const handleSocialSignIn = (provider: string) => {
    // Mock social sign in
    const user = {
      id: '1',
      name: 'Иван Иванов',
      email: 'user@example.com',
      phone: '+79001234567',
      location: 'Москва, Россия',
    }
    storage.setUser(user)
    router.push('/home')
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header showBack />
      <div className="max-w-md mx-auto px-6 py-8 w-full overflow-x-hidden">
        <div className="mb-8 glass-card p-6 animate-scale-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            С возвращением!
          </h1>
          <p className="text-gray-900">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 animate-fade-in">
          <Input
            type="email"
            label="Email"
            placeholder="ivan@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          />

          <Input
            type="password"
            label="Пароль"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          />

          <Link
            href="/forgot-password"
            className="block text-right text-sm text-primary-green hover:underline"
          >
            Забыли пароль?
          </Link>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button type="submit" fullWidth className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Войти
          </Button>
        </form>

        <div className="space-y-3 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleSocialSignIn('google')}
            className="animate-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold">G</span>
              Войти через Google
            </div>
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => handleSocialSignIn('twitter')}
            className="animate-slide-up"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-400">🐦</span>
              Войти через Twitter
            </div>
          </Button>
        </div>

      </div>
    </div>
  )
}

