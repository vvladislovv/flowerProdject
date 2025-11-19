'use client'

import { Suspense } from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { FiSend } from 'react-icons/fi'
import { ChatMessage } from '@/lib/types'

const CHAT_STORAGE_PREFIX = 'flowers_chat_history'

const createWelcomeMessages = (): ChatMessage[] => [
  {
    id: `welcome-${Date.now()}`,
    sender: 'florist',
    text: 'Здравствуйте! Чем могу помочь с вашим заказом?',
    timestamp: new Date().toISOString(),
  },
]

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  )
}

function ChatContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const storageKey = useMemo(
    () => (orderId ? `${CHAT_STORAGE_PREFIX}:${orderId}` : CHAT_STORAGE_PREFIX),
    [orderId]
  )

  const [messages, setMessages] = useState<ChatMessage[]>(createWelcomeMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        } else {
          setMessages(createWelcomeMessages())
        }
      } catch {
        setMessages(createWelcomeMessages())
      }
    } else {
      setMessages(createWelcomeMessages())
    }
    setIsLoaded(true)
  }, [storageKey])

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages, storageKey, isLoaded])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage('')

    // Simulate florist response
    setTimeout(() => {
      const floristMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'florist',
        text: 'Спасибо за сообщение! Я уточню детали и скоро вернусь с ответом.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, floristMessage])
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Header title="Чат с флористом" showBack showCart={false} />

      <div className="flex-1 overflow-y-auto pb-20 max-w-md mx-auto w-full overflow-x-hidden">
        {orderId && (
          <div className="px-4 pt-4 text-center text-sm text-gray-500">
            Обсуждаем заказ №{orderId}
          </div>
        )}
        <div className="px-4 py-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex animate-slide-up ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] px-4 py-2 border backdrop-blur-lg ${
                  message.sender === 'user'
                    ? 'glass bg-primary-green/80 text-gray-900 border-primary-green/50 shadow-lg'
                    : 'glass-card text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-gray-600'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/30 p-4 max-w-md mx-auto"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-2 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <button
            type="submit"
            className="p-2 glass bg-primary-green/80 text-white border border-primary-green/50 hover:bg-primary-green hover:shadow-lg transition-all duration-200"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

function ChatLoading() {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Header title="Чат с флористом" showBack showCart={false} />
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Загружаем чат...
      </div>
    </div>
  )
}

