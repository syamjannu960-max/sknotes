import { getCourseBySlug, getSemestersForCourse } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";

export default async function CourseInnerLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: { courseSlug: string };
  }) {
    const course = await getCourseBySlug(params.courseSlug);
    if (!course) notFound();

    const semesters = await getSemestersForCourse(course.id);

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                <div className="sticky top-24 space-y-4">
                    <Card>
                        <div className="p-4">
                            <h2 className="font-headline text-lg font-semibold">{course.name}</h2>
                            <p className="text-sm text-muted-foreground">Select a semester to begin</p>
                        </div>
                        <nav className="p-2 pt-0">
                            <ul>
                                {semesters.map(semester => (
                                    <li key={semester.id}>
                                        <Link href={`/courses/${course.slug}/${semester.slug}`}>
                                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
                                                <Book className="h-4 w-4 text-primary" />
                                                <span>{semester.name}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Card>
                </div>
            </aside>
            <div className="flex-grow min-w-0">
                {children}
            </div>
        </div>
    )
}
