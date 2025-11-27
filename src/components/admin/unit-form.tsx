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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
  const [uploadPdf, setUploadPdf] = useState(false);
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: defaultValue || { title: "", subjectId: "", chapterTitle: "", chapterContent: "", pdfUrl: "" },
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
                    <FormControl><Input placeholder="e.g., Introduction to Programming" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="chapterTitle" render={({ field }) => (
                <FormItem>
                    <FormLabel>Chapter Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Variables and Data Types" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="chapterContent" render={({ field }) => (
                <FormItem>
                    <FormLabel>Chapter Content</FormLabel>
                    <FormControl><Textarea placeholder="Write the full content for this chapter." {...field} rows={12} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <div className="flex items-center space-x-2">
              <Switch id="pdf-upload-switch" checked={uploadPdf} onCheckedChange={setUploadPdf} />
              <Label htmlFor="pdf-upload-switch">Upload PDF</Label>
            </div>
            {uploadPdf ? (
              <FormField control={form.control} name="pdfFile" render={({ field }) => (
                <FormItem>
                  <FormLabel>PDF File</FormLabel>
                  <FormControl><Input type="file" accept=".pdf" onChange={(e) => field.onChange(e.target.files?.[0])} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ) : (
              <FormField control={form.control} name="pdfUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>PDF URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/document.pdf" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
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
