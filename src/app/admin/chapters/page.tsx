
"use client";

import { useState, useTransition, useEffect } from "react";
import { getChapters, getCourses, getSemesters } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ChapterForm } from "@/components/admin/chapter-form";
import { ChapterFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { Chapter, Course, Semester } from "@/lib/types";
import { addChapter, updateChapter, deleteChapter } from "@/lib/actions";

export default function ChaptersAdminPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isFetching, startFetching] = useTransition();
    const [isSubmitting, startSubmitting] = useTransition();
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | undefined>(undefined);

    useEffect(() => {
        startFetching(async () => {
            const [chaptersData, coursesData, semestersData] = await Promise.all([getChapters(), getCourses(), getSemesters()]);
            setChapters(chaptersData);
            setCourses(coursesData);
            setSemesters(semestersData);
        });
    }, []);

    const fetchChapters = async () => {
        const chaptersData = await getChapters();
        setChapters(chaptersData);
    }

    const openNewForm = () => {
        setSelectedChapter(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setIsFormOpen(true);
    };
    
    const openDeleteDialog = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setIsDeleteOpen(true);
    }

    const handleFormSubmit = async (values: ChapterFormValues) => {
        startSubmitting(async () => {
            const action = values.id ? updateChapter : addChapter;
            const result = await action(values);

            if (result.success) {
                toast({ title: `Chapter ${values.id ? 'updated' : 'added'} successfully` });
                fetchChapters();
                setIsFormOpen(false);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedChapter) return;
        startSubmitting(async () => {
            const result = await deleteChapter(selectedChapter.id);
            if (result.success) {
                toast({ title: "Chapter deleted successfully" });
                fetchChapters();
                setIsDeleteOpen(false);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    }
    
    const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.name || 'N/A';
    const getSemesterName = (semesterId: string) => semesters.find(s => s.id === semesterId)?.name || 'N/A';

    return (
        <div>
            <AdminPageHeader title="Manage Chapters" actionText="Add Chapter" onActionClick={openNewForm} />
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Chapter Title</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                        ) : chapters.map(chapter => (
                            <TableRow key={chapter.id}>
                                <TableCell className="font-medium">{chapter.title}</TableCell>
                                <TableCell>{getCourseName(chapter.courseId)}</TableCell>
                                <TableCell>{getSemesterName(chapter.semesterId)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEditForm(chapter)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(chapter)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isFormOpen && <ChapterForm 
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                defaultValue={selectedChapter}
                isSubmitting={isSubmitting}
                courses={courses}
                semesters={semesters}
            />}

            <DeleteConfirmationDialog 
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
                itemName={selectedChapter?.title || ''}
            />
        </div>
    );
}
