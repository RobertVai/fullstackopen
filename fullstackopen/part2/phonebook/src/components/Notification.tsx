import type { NotificationData } from '../types'
import styles from './Notification.module.css'

type NotificationProps = { notification: NotificationData | null }

const Notification = ({ notification }: NotificationProps) => {
  if (!notification) return null

  return (
    <div
      role="status"
      className={notification.type === 'success' ? styles.success : styles.error}
    >
      {notification.message}
    </div>
  )
}

export default Notification
