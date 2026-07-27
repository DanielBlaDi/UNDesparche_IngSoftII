import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useAuth } from '../../auth/hooks/useAuth'
import { useSubscriptions } from '../hooks/useSubscriptions'
import type { EventStatus } from '../types/event.types'
import GuestSubscriptionDialog from './GuestSubscriptionDialog'

interface SubscriptionButtonProps {
  eventId: number
  eventStatus: EventStatus
  isSubscribed: boolean
  published: boolean
  organizerId: number
  size?: 'small' | 'medium' | 'large'
}

export default function SubscriptionButton({ eventId, eventStatus, isSubscribed, published, organizerId, size = 'medium' }: SubscriptionButtonProps) {
  const { isAuthenticated, profile } = useAuth()
  const { subscribe, unsubscribe, loading, error } = useSubscriptions()
  const isPast = eventStatus === 'FIN' || eventStatus === 'CAN'
  const isOrganizer = profile?.id === organizerId
  const [subscribed, setSubscribed] = useState(isSubscribed)
  const [guestDialogOpen, setGuestDialogOpen] = useState(false)
  const [guestSubscribed, setGuestSubscribed] = useState(false)
  const [guestEmail, setGuestEmail] = useState<string | null>(null)

  useEffect(() => {
    setSubscribed(isSubscribed)
  }, [isSubscribed])

  useEffect(() => {
    if (!isAuthenticated) {
      const email = localStorage.getItem(`guest_subscription_${eventId}`)
      if (email) {
        setGuestEmail(email)
        setGuestSubscribed(true)
      } else {
        setGuestEmail(null)
        setGuestSubscribed(false)
      }
    }
  }, [isAuthenticated, eventId])

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      setGuestDialogOpen(true)
      return
    }
    try {
      await subscribe(eventId)
      setSubscribed(true)
    } catch {
      setSubscribed(true)
    }
  }

  const handleGuestSubmit = async (email: string) => {
    try {
      await subscribe(eventId, email)
      localStorage.setItem(`guest_subscription_${eventId}`, email)
      setGuestEmail(email)
      setGuestDialogOpen(false)
      setGuestSubscribed(true)
    } catch {
      // El error se maneja en el hook y se muestra en el dialog
    }
  }

  const handleGuestUnsubscribe = async () => {
    if (!guestEmail) return
    try {
      await unsubscribe(eventId, guestEmail)
      localStorage.removeItem(`guest_subscription_${eventId}`)
      setGuestEmail(null)
      setGuestSubscribed(false)
    } catch {
      // Manejo de error si es necesario
    }
  }

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe(eventId)
      setSubscribed(false)
    } catch {
      setSubscribed(false)
    }
  }

  if (isOrganizer) {
    return (
      <Box sx={{ textAlign: 'center', py: 1 }}>
        <Typography variant="body2" color="text.secondary">Eres el organizador de este evento</Typography>
      </Box>
    )
  }

  if (isPast || !published) {
    return (
      <Button variant="contained" disabled size={size} sx={{ width: '100%' }}>
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 18, mr: 0.5 }}>block</Icon>
        {isPast ? 'Evento Pasado' : 'No Disponible'}
      </Button>
    )
  }

  if (!isAuthenticated && guestSubscribed) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        size={size}
        disabled={loading}
        onClick={handleGuestUnsubscribe}
        sx={{ width: '100%' }}
      >
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 18, mr: 0.5 }}>check</Icon>
        Suscrito
      </Button>
    )
  }

  if (subscribed) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        size={size}
        disabled={loading}
        onClick={handleUnsubscribe}
        sx={{ width: '100%' }}
      >
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 18, mr: 0.5 }}>check</Icon>
        Suscrito
      </Button>
    )
  }

  return (
    <>
      <Button
        variant="contained"
        size={size}
        disabled={loading}
        onClick={handleSubscribe}
        sx={{ width: '100%' }}
      >
        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 18, mr: 0.5 }}>person_add</Icon>
        Suscribirme
      </Button>

      <GuestSubscriptionDialog
        open={guestDialogOpen}
        onClose={() => setGuestDialogOpen(false)}
        onSubmit={handleGuestSubmit}
        loading={loading}
        error={error}
      />
    </>
  )
}
