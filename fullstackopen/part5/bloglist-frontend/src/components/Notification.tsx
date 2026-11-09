import type { NotificationState } from '../types'
import { Notice } from './ui'

interface Props {
  notification: NotificationState | null
}

export default function Notification({ notification }: Props) {
  if (!notification) return null

  return (
    <Notice $error={notification.error} role={notification.error ? 'alert' : 'status'}>
      {notification.message}
    </Notice>
  )
}
