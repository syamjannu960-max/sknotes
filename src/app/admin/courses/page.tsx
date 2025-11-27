"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { addCourse, updateCourse, deleteCourse } from "@/lib/actions";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { Course } from "@/lib/types";

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(
    undefined
  );

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      const json = await res.json();

      if (json.success) {
        setCourses(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openNewForm = () => {
    console.log("openNewForm called");
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
  };

  const handleFormSubmit = async (values: any) => {
    setSaving(true);
    const isUpdate = Boolean(values.id);
    const result = isUpdate
      ? await updateCourse(values.id, values)
      : await addCourse(values);

    if (result.success) {
      toast({
        title: `Course ${isUpdate ? "updated" : "added"} successfully`,
      });
      fetchCourses();
      setIsFormOpen(false);
    } else if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }

    setSaving(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourse) return;

    setSaving(true);
    const result = await deleteCourse(selectedCourse.id);

    if (result.success) {
      toast({ title: "Course deleted successfully" });
      fetchCourses();
      setIsDeleteOpen(false);
    } else if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Error deleting course",
        description: result.error,
      });
    }

    setSaving(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Manage Courses"
        actionText="Add Course"
        onActionClick={openNewForm}
      />

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditForm(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDeleteDialog(course)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      {isFormOpen && (
        <CourseForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          defaultValue={selectedCourse}
          isSubmitting={saving}
        />
      )}

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        itemName={selectedCourse?.name || ""}
      />
    </div>
  );
}
