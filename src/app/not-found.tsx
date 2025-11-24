import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-9xl font-bold font-headline text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl font-headline">Page Not Found</h2>
      <p className="mt-4 text-lg text-muted-foreground">Sorry, we couldn’t find the page you’re looking for.</p>
      <Button asChild className="mt-8">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}
