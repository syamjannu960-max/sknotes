import { z } from 'zod';

export const courseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Course name must be at least 3 characters long."),
});
export type CourseFormValues = z.infer<typeof courseSchema>;

export const semesterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Semester name must be at least 3 characters long."),
});
export type SemesterFormValues = z.infer<typeof semesterSchema>;

export const chapterSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(5, "Chapter title must be at least 5 characters long."),
    courseId: z.string().min(1, "You must select a course."),
    semesterId: z.string().min(1, "You must select a semester."),
    description: z.string().min(20, "Description must be at least 20 characters long."),
    pdfUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
});
export type ChapterFormValues = z.infer<typeof chapterSchema>;

export const unitSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(5, "Unit title must be at least 5 characters long."),
    chapterId: z.string().min(1, "You must select a chapter."),
    content: z.string().min(20, "Content must be at least 20 characters long."),
});
export type UnitFormValues = z.infer<typeof unitSchema>;
