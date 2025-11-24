
"use client";

import { useState, useTransition, useEffect } from "react";
import { getCourses } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourseForm } from "@/components/admin/course-form";
import { CourseFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { addCourse, updateCourse, deleteCourse } from "@/lib/actions";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { Course } from "@/lib/types";

// This would typically be a server component fetching initial data
// but we make it client to handle state easily for this example.
export default function CoursesAdminPage() {
    // In a real app, this would be `const initialCourses = await getCourses()` passed as a prop
    const [courses, setCourses] = useState<Course[]>([]);
    const [isFetching, startFetching] = useTransition();
    const [isSubmitting, startSubmitting] = useTransition();

    const { toast } = useToast();

    // Dialog states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);

    useEffect(() => {
        startFetching(async () => {
            const data = await getCourses();
            setCourses(data);
        });
    }, []);

    const openNewForm = () => {
        setSelectedCourse(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (course: Course) => {
        setSelectedCourse(course);
        setIsFormOpen(true);
    };
    
    const openDeleteDialog = (course: Course) => {
        setSelectedCourse(course);
        setIsDeleteOpen(true);
    }

    const handleFormSubmit = async (values: CourseFormValues) => {
        startSubmitting(async () => {
            const action = values.id ? updateCourse : addCourse;
            // @ts-ignore
            const result = await action(values);

            if (result.success) {
                toast({ title: `Course ${values.id ? 'updated' : 'added'} successfully` });
                // In a real app, we'd refetch or update state smartly
                const data = await getCourses();
                setCourses(data);
                setIsFormOpen(false);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCourse) return;
        
        startSubmitting(async () => {
             const result = await deleteCourse(selectedCourse.id);
             if (result.success) {
                toast({ title: "Course deleted successfully" });
                const data = await getCourses();
                setCourses(data);
                setIsDeleteOpen(false);
             } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
             }
        });
    }

    return (
        <div>
            <AdminPageHeader title="Manage Courses" actionText="Add Course" onActionClick={openNewForm} />
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow><TableCell colSpan={2} className="text-center">Loading...</TableCell></TableRow>
                        ) : courses.map(course => (
                            <TableRow key={course.id}>
                                <TableCell className="font-medium">{course.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEditForm(course)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(course)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <CourseForm 
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                defaultValue={selectedCourse}
                isSubmitting={isSubmitting}
            />

            <DeleteConfirmationDialog 
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
                itemName={selectedCourse?.name || ''}
            />
        </div>
    );
