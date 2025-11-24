import { getCourseBySlug, getSemesterBySlug, getChapterBySlug, getUnitBySlug, getUnitsForChapter } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/user/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
    params: { courseSlug: string; semesterSlug: string; chapterSlug: string; unitSlug: string; }
};

export async function generateMetadata({ params }: Props) {
    const chapter = await getChapterBySlug(params.chapterSlug);
    if (!chapter) notFound();
    const unit = await getUnitBySlug(params.unitSlug, chapter.id);
    if (!unit) notFound();
    return { title: `${unit.title} | ${chapter.title} | CourseNote` };
}

export default async function UnitPage({ params }: Props) {
    const course = await getCourseBySlug(params.courseSlug);
    const semester = await getSemesterBySlug(params.semesterSlug);
    const chapter = await getChapterBySlug(params.chapterSlug);

    if (!course || !semester || !chapter) notFound();

    const unit = await getUnitBySlug(params.unitSlug, chapter.id);
    if (!unit) notFound();

    const allUnits = await getUnitsForChapter(chapter.id);
    const currentIndex = allUnits.findIndex(u => u.id === unit.id);
    const prevUnit = currentIndex > 0 ? allUnits[currentIndex - 1] : null;
    const nextUnit = currentIndex < allUnits.length - 1 ? allUnits[currentIndex + 1] : null;

    const breadcrumbItems = [
        { label: 'Courses', href: '/courses' },
        { label: course.name, href: `/courses/${course.slug}` },
        { label: semester.name, href: `/courses/${course.slug}/${semester.slug}` },
        { label: chapter.title, href: `/courses/${course.slug}/${semester.slug}/${chapter.slug}` },
        { label: unit.title, href: `/courses/${course.slug}/${semester.slug}/${chapter.slug}/${unit.slug}` },
    ];

    return (
        <div>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <p className="text-base text-primary font-semibold">{chapter.title}</p>
                    <h1 className="text-4xl font-bold font-headline">{unit.title}</h1>
                </div>
                {chapter.pdfUrl && (
                    <Button asChild className="flex-shrink-0">
                        <Link href={chapter.pdfUrl} target="_blank">
                            <Download className="mr-2 h-4 w-4" />
                            Download Chapter PDF
                        </Link>
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: unit.content }} />
                </CardContent>
            </Card>

            <div className="mt-8 flex justify-between items-center">
                {prevUnit ? (
                    <Button asChild variant="outline">
                        <Link href={`/courses/${course.slug}/${semester.slug}/${chapter.slug}/${prevUnit.slug}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Prev: {prevUnit.title}
                        </Link>
                    </Button>
                ) : <div />}
                {nextUnit ? (
                    <Button asChild variant="outline">
                        <Link href={`/courses/${course.slug}/${semester.slug}/${chapter.slug}/${nextUnit.slug}`}>
                            Next: {nextUnit.title} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                ) : <div />}
            </div>
        </div>
    );
}
