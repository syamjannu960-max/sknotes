
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCourses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { slugify } from '@/lib/utils';

export const metadata = {
  title: 'Courses | SKNotes',
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Our Courses</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">Explore our comprehensive collection of notes and materials, designed for your academic success.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => {
            const placeholder = PlaceHolderImages.find(p => p.imageUrl === course.imageUrl);
            const imageUrl = course.imageUrl || `https://picsum.photos/seed/${slugify(course.name)}/600/400`;
            return (
              <Link href={`/courses/${course.slug}`} key={course.id} className="group block">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1.5 border-2 border-transparent hover:border-primary">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                        <Image
                          src={imageUrl}
                          alt={course.name}
                          fill
                          className="object-cover"
                          data-ai-hint={placeholder?.imageHint || 'education'}
                        />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex items-center justify-between">
                    <CardTitle className="text-lg font-headline">{course.name}</CardTitle>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"/>
                  </CardContent>
                </Card>
              </Link>
            )
        })}
      </div>
    </div>
  );
}
