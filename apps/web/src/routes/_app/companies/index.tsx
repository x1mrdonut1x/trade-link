import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/companies/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/companies/"!</div>
}
