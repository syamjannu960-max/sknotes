'use client';

import Link from 'next/link';
import { BookOpen, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { Course } from '@/lib/types';

export function Header() {
  const pathname = usePathname();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        const json = await res.json();
        if (json.success) {
          setCourses(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    }
    fetchCourses();
  }, []);

  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/courses" className="flex items-center gap-2 group">
            <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:rotate-[-5deg] group-hover:scale-110" />
            <span className="text-xl font-headline font-bold text-foreground group-hover:text-primary transition-colors">SKNotes</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className={cn("text-muted-foreground hover:text-primary transition-colors px-3 py-2", pathname.startsWith('/courses') && "text-primary font-semibold")}>
                  Courses <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                   <Link href="/courses">All Courses</Link>
                </DropdownMenuItem>
                {courses.map((course) => (
                  <DropdownMenuItem key={course.id} asChild>
                    <Link href={`/courses/${course.slug}`}>{course.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
