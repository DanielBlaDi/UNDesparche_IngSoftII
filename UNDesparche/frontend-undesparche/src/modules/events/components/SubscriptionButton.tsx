import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useAuth } from '../../auth/hooks/useAuth'
import { useSubscriptions } from '../hooks/useSubscriptions'
import type { EventStatus } from '../types/event.types'

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
  const { subscribe, unsubscribe, loading } = useSubscriptions()
  const navigate = useNavigate()
  const isPast = eventStatus === 'FIN' || eventStatus === 'CAN'
  const isOrganizer = profile?.id === organizerId
  const [subscribed, setSubscribed] = useState(isSubscribed)

  useEffect(() => {
    setSubscribed(isSubscribed)
  }, [isSubscribed])

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await subscribe(eventId)
      setSubscribed(true)
    } catch {
      setSubscribed(true)
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
  )
}
