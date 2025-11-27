'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    // Add other links here if needed
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/courses" className="flex items-center gap-2 group">
            <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:rotate-[-5deg] group-hover:scale-110" />
            <span className="text-xl font-headline font-bold text-foreground group-hover:text-primary transition-colors">SKNotes</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Button asChild variant="link" key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors px-3 py-2",
                    pathname.startsWith(link.href) && "text-primary font-semibold"
                  )}
                >
                  {link.label}
                </Link>
              </Button>
            ))}
             <Button asChild variant="ghost">
                <Link href="/admin/login">Admin</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
