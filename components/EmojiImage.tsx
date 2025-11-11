'use client'

import Image from 'next/image'

interface EmojiImageProps {
  emoji: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
  xl: 'text-9xl',
}

// Helper function to check if image is a URL
const isImageUrl = (image: string): boolean => {
  return image.startsWith('http://') || image.startsWith('https://') || image.startsWith('//')
}

export default function EmojiImage({ emoji, size = 'md', className = '' }: EmojiImageProps) {
  if (isImageUrl(emoji)) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <Image
          src={emoji}
          alt="Product"
          width={400}
          height={400}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    )
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className={sizeClasses[size]}>{emoji}</span>
    </div>
  )
}

