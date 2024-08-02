import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/unauthorized')({
  component: () => <div>You are not authorized, you are not an store owner.</div>
})