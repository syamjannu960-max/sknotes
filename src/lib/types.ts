export type Course = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export type Semester = {
  id: string;
  name: string;
  slug: string;
};

export type Chapter = {
  id: string;
  title: string;
  slug: string;
  courseId: string;
  semesterId: string;
  description: string; // Syllabus for the chapter
  pdfUrl?: string; // PDF for the whole chapter
};

export type Unit = {
  id: string;
  title: string;
  slug: string;
  chapterId: string;
  content: string; // Content for this specific unit
};

// For breadcrumbs
export type BreadcrumbItem = {
  label: string;
  href: string;
};
