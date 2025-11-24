import { getCourseBySlug, getSemesterBySlug, getChaptersForSemester } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/user/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, ArrowRight } from "lucide-react";

type Props = {
    params: { courseSlug: string; semesterSlug: string }
};

export async function generateMetadata({ params }: Props) {
    const course = await getCourseBySlug(params.courseSlug);
    const semester = await getSemesterBySlug(params.semesterSlug);
    if (!course || !semester) notFound();
    return { title: `${course.name} - ${semester.name} | CourseNote` };
}

export default async function SemesterPage({ params }: Props) {
  const course = await getCourseBySlug(params.courseSlug);
  const semester = await getSemesterBySlug(params.semesterSlug);
  if (!course || !semester) notFound();
  
  const chapters = await getChaptersForSemester(course.id, semester.id);

  const breadcrumbItems = [
      { label: 'Courses', href: '/courses' },
      { label: course.name, href: `/courses/${course.slug}` },
      { label: semester.name, href: `/courses/${course.slug}/${semester.slug}` },
  ];

  return (
    <div>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl font-bold font-headline mb-2">{semester.name}</h1>
        <p className="text-lg text-muted-foreground mb-8">Chapters available for {course.name}.</p>

        <div className="space-y-4">
            {chapters.length > 0 ? (
                chapters.map(chapter => (
                    <Link href={`/courses/${course.slug}/${semester.slug}/${chapter.slug}`} key={chapter.id} className="group block">
                        <Card className="hover:border-primary hover:bg-muted/50 transition-all duration-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Library className="h-8 w-8 text-primary"/>
                                    <div>
                                        <CardTitle className="text-xl font-headline">{chapter.title}</CardTitle>
                                        <CardDescription className="line-clamp-1" dangerouslySetInnerHTML={{ __html: chapter.description }} />
                                    </div>
                                </div>
                                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-transform"/>
                            </CardHeader>
                        </Card>
                    </Link>
                ))
            ) : (
                <p>No chapters found for this semester.</p>
            )}
        </div>
    </div>
  );
}
