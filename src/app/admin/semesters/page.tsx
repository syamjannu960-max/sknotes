
"use client";

import { useState, useTransition, useEffect } from "react";
import { getSemesters } from "@/lib/data";
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
import { SemesterForm } from "@/components/admin/semester-form";
import { SemesterFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { addSemester, updateSemester, deleteSemester } from "@/lib/actions";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { Semester } from "@/lib/types";

export default function SemestersAdminPage() {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isFetching, startFetching] = useTransition();
    const [isSubmitting, startSubmitting] = useTransition();
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<Semester | undefined>(undefined);
    
    const fetchSemesters = () => {
        startFetching(async () => {
            const data = await getSemesters();
            setSemesters(data || []);
        });
    }

    useEffect(() => {
        fetchSemesters();
    }, []);

    const openNewForm = () => {
        setSelectedSemester(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (semester: Semester) => {
        setSelectedSemester(semester);
        setIsFormOpen(true);
    };
    
    const openDeleteDialog = (semester: Semester) => {
        setSelectedSemester(semester);
        setIsDeleteOpen(true);
    }

    const handleFormSubmit = async (values: SemesterFormValues) => {
        startSubmitting(async () => {
            const action = values.id ? () => updateSemester(values.id!, values) : () => addSemester(values);
            const result = await action();
            if (result.success) {
                toast({ title: `Semester ${values.id ? 'updated' : 'added'} successfully` });
                fetchSemesters();
                setIsFormOpen(false);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedSemester) return;
        
        startSubmitting(async () => {
             const result = await deleteSemester(selectedSemester.id);
             if (result.success) {
                toast({ title: "Semester deleted successfully" });
                fetchSemesters();
                setIsDeleteOpen(false);
             } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
             }
        });
    }

    return (
        <div>
            <AdminPageHeader title="Manage Semesters" actionText="Add Semester" onActionClick={openNewForm} />
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Semester Name</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow><TableCell colSpan={2} className="text-center">Loading...</TableCell></TableRow>
                        ) : semesters.map(semester => (
                            <TableRow key={semester.id}>
                                <TableCell className="font-medium">{semester.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEditForm(semester)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(semester)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isFormOpen && <SemesterForm 
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                defaultValue={selectedSemester}
                isSubmitting={isSubmitting}
            />}

            <DeleteConfirmationDialog 
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
                itemName={selectedSemester?.name || ''}
            />
        </div>
    );
}
