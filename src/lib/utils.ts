/* General utility functions (exposes cn) */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a phone number into a WhatsApp wa.me link.
 * If it's already a URL, returns it as is.
 */
export function formatWhatsAppLink(phone: string): string {
  if (!phone) return ''
  if (phone.startsWith('http')) return phone
  const cleaned = phone.replace(/\D/g, '')
  return `https://wa.me/${cleaned}`
}

// Add any other utility functions here
