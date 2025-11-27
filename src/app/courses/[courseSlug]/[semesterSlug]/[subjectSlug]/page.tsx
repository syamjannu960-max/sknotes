import { getCourseBySlug, getSemesterBySlug, getSubjectBySlug, getUnitsForSubject } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/user/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowRight } from "lucide-react";

type Props = {
    params: { courseSlug: string; semesterSlug: string; subjectSlug: string; }
};

export async function generateMetadata({ params }: Props) {
    const course = await getCourseBySlug(params.courseSlug);
    const semester = await getSemesterBySlug(params.semesterSlug);
    const subject = await getSubjectBySlug(params.subjectSlug);
    if (!course || !semester || !subject) notFound();
    return { title: `${subject.title} | SKNotes` };
}

export default async function SubjectPage({ params }: Props) {
    const course = await getCourseBySlug(params.courseSlug);
    const semester = await getSemesterBySlug(params.semesterSlug);
    const subject = await getSubjectBySlug(params.subjectSlug);
    if (!course || !semester || !subject) notFound();
    
    const units = await getUnitsForSubject(subject.id);

    const breadcrumbItems = [
        { label: 'Courses', href: '/courses' },
        { label: course.name, href: `/courses/${course.slug}` },
        { label: semester.name, href: `/courses/${course.slug}/${semester.slug}` },
        { label: subject.title, href: `/courses/${course.slug}/${semester.slug}/${subject.slug}` },
    ];

    return (
        <div>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-4xl font-bold font-headline">{subject.title}</h1>
                    <p className="text-lg text-muted-foreground mt-2">Syllabus & Units</p>
                </div>
            </div>

            <Card className="mb-8">
                <CardContent className="p-6 prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: subject.description }} />
                </CardContent>
            </Card>

            <h2 className="text-2xl font-bold font-headline mb-4">Units in this Subject</h2>
            <div className="space-y-3">
                {units.length > 0 ? (
                    units.map((unit, index) => (
                        <Link href={`/courses/${course.slug}/${semester.slug}/${subject.slug}/${unit.slug}`} key={unit.id} className="group block">
                            <Card className="hover:border-primary hover:bg-muted/50 transition-colors duration-200">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <FileText className="h-6 w-6 text-primary" />
                                        <span className="font-semibold text-lg">{`Unit ${index + 1}: ${unit.title}`}</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <p>No units found for this subject.</p>
                )}
            </div>
        </div>
    );
}
