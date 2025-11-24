
"use client";

import { useState, useTransition, useEffect } from "react";
import { getUnits, getSubjects } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UnitForm } from "@/components/admin/unit-form";
import { UnitFormValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { Unit, Subject } from "@/lib/types";
import { addUnit, updateUnit, deleteUnit } from "@/lib/actions";

export default function UnitsAdminPage() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isFetching, startFetching] = useTransition();
    const [isSubmitting, startSubmitting] = useTransition();
    const { toast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>(undefined);

    const fetchAllData = () => {
        startFetching(async () => {
            const [unitsData, subjectsData] = await Promise.all([getUnits(), getSubjects()]);
            setUnits(unitsData || []);
            setSubjects(subjectsData || []);
        });
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    const openNewForm = () => {
        setSelectedUnit(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsFormOpen(true);
    };
    
    const openDeleteDialog = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsDeleteOpen(true);
    }

    const handleFormSubmit = async (values: UnitFormValues) => {
        startSubmitting(async () => {
            const action = values.id ? () => updateUnit(values.id!, values) : () => addUnit(values);
            const result = await action();

            if (result.success) {
                toast({ title: `Unit ${values.id ? 'updated' : 'added'} successfully` });
                fetchAllData();
                setIsFormOpen(false);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedUnit) return;
        startSubmitting(async () => {
            const result = await deleteUnit(selectedUnit.id);
            if (result.success) {
                toast({ title: "Unit deleted successfully" });
                fetchAllData();
                setIsDeleteOpen(false);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    }
    
    const getSubjectTitle = (subjectId: string) => subjects.find(s => s.id === subjectId)?.title || 'N/A';

    return (
        <div>
            <AdminPageHeader title="Manage Units" actionText="Add Unit" onActionClick={openNewForm} />
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit Title</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
                        ) : units.map(unit => (
                            <TableRow key={unit.id}>
                                <TableCell className="font-medium">{unit.title}</TableCell>
                                <TableCell>{getSubjectTitle(unit.subjectId)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEditForm(unit)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(unit)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isFormOpen && <UnitForm 
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                defaultValue={selectedUnit}
                isSubmitting={isSubmitting}
                subjects={subjects}
            />}

            <DeleteConfirmationDialog 
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
                itemName={selectedUnit?.title || ''}
            />
        </div>
    );
}
