
"use client";

import { useState, useTransition, useEffect } from "react";
import { getSubjects, getCourses, getSemesters } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SubjectForm } from "@/components/admin/subject-form";
import { SubjectFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { Subject, Course, Semester } from "@/lib/types";
import { addSubject, updateSubject, deleteSubject } from "@/lib/actions";

export default function SubjectsAdminPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isFetching, startFetching] = useTransition();
    const [isSubmitting, startSubmitting] = useTransition();
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(undefined);

    const fetchAllData = () => {
        startFetching(async () => {
            const [subjectsData, coursesData, semestersData] = await Promise.all([getSubjects(), getCourses(), getSemesters()]);
            setSubjects(subjectsData || []);
            setCourses(coursesData || []);
            setSemesters(semestersData || []);
        });
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const openNewForm = () => {
        setSelectedSubject(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (subject: Subject) => {
        setSelectedSubject(subject);
        setIsFormOpen(true);
    };
    
    const openDeleteDialog = (subject: Subject) => {
        setSelectedSubject(subject);
        setIsDeleteOpen(true);
    }

    const handleFormSubmit = async (values: SubjectFormValues) => {
        startSubmitting(async () => {
            const action = values.id ? () => updateSubject(values.id!, values) : () => addSubject(values);
            const result = await action();

            if (result.success) {
                toast({ title: `Subject ${values.id ? 'updated' : 'added'} successfully` });
                fetchAllData();
                setIsFormOpen(false);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedSubject) return;
        startSubmitting(async () => {
            const result = await deleteSubject(selectedSubject.id);
            if (result.success) {
                toast({ title: "Subject deleted successfully" });
                fetchAllData();
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
            <AdminPageHeader title="Manage Subjects" actionText="Add Subject" onActionClick={openNewForm} />
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject Title</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                        ) : subjects.map(subject => (
                            <TableRow key={subject.id}>
                                <TableCell className="font-medium">{subject.title}</TableCell>
                                <TableCell>{getCourseName(subject.courseId)}</TableCell>
                                <TableCell>{getSemesterName(subject.semesterId)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEditForm(subject)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(subject)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isFormOpen && <SubjectForm 
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                defaultValue={selectedSubject}
                isSubmitting={isSubmitting}
                courses={courses}
                semesters={semesters}
            />}

            <DeleteConfirmationDialog 
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
                itemName={selectedSubject?.title || ''}
            />
        </div>
    );
}
