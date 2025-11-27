import { getCourseBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/user/breadcrumb";

type Props = {
    params: { courseSlug: string }
};

export async function generateMetadata({ params }: Props) {
    const course = await getCourseBySlug(params.courseSlug);
    if (!course) notFound();
    return { title: `${course.name} | SKNotes` };
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourseBySlug(params.courseSlug);
  if (!course) notFound();

  const breadcrumbItems = [
      { label: 'Courses', href: '/courses' },
      { label: course.name, href: `/courses/${course.slug}` },
  ];

  return (
    <div>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl font-bold font-headline mb-4">{course.name}</h1>
        <p className="text-lg text-muted-foreground">
            Welcome to the {course.name} page. Please select a semester from the navigation panel on the left to view the available chapters.
        </p>
    </div>
  );
}
