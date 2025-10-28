'use client'

import { useEffect } from 'react'

interface TrackClickProps {
  linkId: string
  promoCode: string
}

export function TrackClick({ linkId, promoCode }: TrackClickProps) {
  useEffect(() => {
    const trackAndRedirect = async () => {
      try {
        // Enregistrer le clic
        await fetch('/api/track/click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ linkId }),
        })

        // Rediriger vers la destination avec le code promo
        // Vous pouvez personnaliser cette URL selon vos besoins
        const destinationUrl = `https://alixia.ch?promo=${promoCode}`
        window.location.href = destinationUrl
      } catch (error) {
        console.error('Error tracking click:', error)
        // Rediriger quand même en cas d'erreur
        window.location.href = `https://alixia.ch?promo=${promoCode}`
      }
    }

    trackAndRedirect()
  }, [linkId, promoCode])

  return null
}
