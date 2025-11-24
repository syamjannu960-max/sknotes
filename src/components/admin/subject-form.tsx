"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubjectFormValues, subjectSchema } from "@/lib/schemas";
import { Course, Semester } from "@/lib/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { enrichSubjectContent } from "@/ai/flows/enrich-subject-content";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type SubjectFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SubjectFormValues) => void;
  defaultValue?: SubjectFormValues;
  isSubmitting: boolean;
  courses: Course[];
  semesters: Semester[];
};

export function SubjectForm({
  isOpen, onOpenChange, onSubmit, defaultValue, isSubmitting, courses, semesters
}: SubjectFormProps) {
  const { toast } = useToast();
  const [isEnriching, setIsEnriching] = useState(false);
  const [suggestions, setSuggestions] = useState('');

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: defaultValue || { title: "", courseId: "", semesterId: "", description: "", pdfUrl: "" },
  });

  const handleEnrichContent = async () => {
    const currentDescription = form.getValues('description');
    if (!currentDescription || currentDescription.length < 20) {
      toast({ variant: 'destructive', title: 'Content is too short', description: 'Write more content in the description to get relevant suggestions.' });
      return;
    }
    setIsEnriching(true);
    setSuggestions('');
    try {
      const result = await enrichSubjectContent({ subjectText: currentDescription });
      setSuggestions(result.suggestedTopics);
      toast({ title: 'AI Suggestions Generated!', description: 'Check the suggestions below the form.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'AI Enrichment Failed' });
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{defaultValue?.id ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="courseId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Course</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger></FormControl>
                        <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="semesterId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a semester" /></SelectTrigger></FormControl>
                        <SelectContent>{semesters.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                    <FormLabel>Subject Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Introduction to Algorithms" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>Description / Syllabus</FormLabel>
                        <Button type="button" size="sm" variant="outline" onClick={handleEnrichContent} disabled={isEnriching}>
                            {isEnriching ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />}
                            Enrich with AI
                        </Button>
                    </div>
                    <FormControl><Textarea placeholder="Provide a detailed description or syllabus for the subject." {...field} rows={8} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            {suggestions && (
              <Alert>
                <Sparkles className="h-4 w-4"/>
                <AlertTitle>AI Suggested Topics</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap text-xs">{suggestions}</AlertDescription>
              </Alert>
            )}
            <FormField control={form.control} name="pdfUrl" render={({ field }) => (
                <FormItem>
                    <FormLabel>PDF URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://example.com/subject.pdf" {...field} /></FormControl>
                    <FormDescription>Link to a publicly accessible PDF file for this subject.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
              <DialogClose asChild><Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Subject"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
