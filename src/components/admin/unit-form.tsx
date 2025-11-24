"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitFormValues, unitSchema } from "@/lib/schemas";
import { Subject } from "@/lib/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

type UnitFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UnitFormValues) => void;
  defaultValue?: UnitFormValues;
  isSubmitting: boolean;
  subjects: Subject[];
};

export function UnitForm({
  isOpen, onOpenChange, onSubmit, defaultValue, isSubmitting, subjects
}: UnitFormProps) {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: defaultValue || { title: "", subjectId: "", content: "" },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{defaultValue?.id ? "Edit Unit" : "Add New Unit"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4">
            <FormField control={form.control} name="subjectId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                    <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                    <FormLabel>Unit Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Variables and Data Types" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                    <FormLabel>Unit Content</FormLabel>
                    <FormControl><Textarea placeholder="Write the full content for this unit." {...field} rows={12} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
              <DialogClose asChild><Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Unit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
