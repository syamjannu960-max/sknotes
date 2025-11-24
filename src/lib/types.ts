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

export type Subject = {
  id: string;
  title: string;
  slug: string;
  courseId: string;
  semesterId: string;
  description: string; // Syllabus for the subject
  pdfUrl?: string; // PDF for the whole subject
};

export type Unit = {
  id: string;
  title: string;
  slug: string;
  subjectId: string;
  content: string; // Content for this specific unit
};

// For breadcrumbs
export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type CourseWithId = Course & { id: string };
export type SemesterWithId = Semester & { id: string };
export type SubjectWithId = Subject & { id: string };
export type UnitWithId = Unit & { id: string };
