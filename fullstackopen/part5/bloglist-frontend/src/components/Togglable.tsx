import type { ReactNode } from 'react'
import { Actions, SecondaryButton } from './ui'

interface Props {
  open: boolean
  onToggle: () => void
  children: ReactNode
}

export default function Togglable({ open, onToggle, children }: Props) {
  return (
    <div>
      <Actions>
        <SecondaryButton onClick={onToggle} type="button">
          {open ? 'cancel' : 'create new'}
        </SecondaryButton>
      </Actions>
      {open && children}
    </div>
  )
}
