'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ProductImageSlotProps {
  src?: string
  alt: string
  aspectRatio?: '1:1' | '4:3' | '3:4' | '16:9' | '4:5'
  priority?: boolean
  className?: string
  fill?: boolean
  sizes?: string
}

const aspectRatioMap = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '3:4': 'aspect-[3/4]',
  '16:9': 'aspect-video',
  '4:5': 'aspect-[4/5]',
}

// Gradient placeholders that look like premium product photography
const placeholderGradients = [
  'from-stone-200 via-stone-100 to-stone-200',
  'from-amber-50 via-stone-100 to-amber-50',
  'from-stone-100 via-amber-50 to-stone-100',
]

export function ProductImageSlot({
  src,
  alt,
  aspectRatio = '1:1',
  priority = false,
  className,
  fill = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: ProductImageSlotProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const aspectClass = aspectRatioMap[aspectRatio]
  const showPlaceholder = !src || hasError
  
  // Pick a consistent gradient based on alt text
  const gradientIndex = alt.length % placeholderGradients.length
  const gradient = placeholderGradients[gradientIndex]
  
  if (showPlaceholder) {
    return (
      <div 
        className={cn(
          'relative overflow-hidden bg-gradient-to-br rounded-lg',
          gradient,
          !fill && aspectClass,
          fill && 'absolute inset-0',
          className
        )}
        role="img"
        aria-label={alt}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Center icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-stone-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>
    )
  }
  
  if (fill) {
    return (
      <div className={cn('relative', className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
        {isLoading && (
          <div className={cn(
            'absolute inset-0 bg-gradient-to-br animate-pulse',
            gradient
          )} />
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('relative overflow-hidden rounded-lg', aspectClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      {isLoading && (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br animate-pulse',
          gradient
        )} />
      )}
    </div>
  )
}
