import { Navigate, createFileRoute } from '@tanstack/react-router'
import { beforeLoadRouteGuardLoginCheck } from '../util/beforeLoadRouteGuard'

export const Route = createFileRoute('/')({
  beforeLoad: beforeLoadRouteGuardLoginCheck,
  component: Index
})

function Index() {

    return (<Navigate to="/home"></Navigate>)
}