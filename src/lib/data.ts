import type { Course, Semester, Chapter, Unit } from './types';
import { PlaceHolderImages } from './placeholder-images';

const csImage = PlaceHolderImages.find(p => p.id === 'course-cs')!.imageUrl;
const mechImage = PlaceHolderImages.find(p => p.id === 'course-mech')!.imageUrl;
const civilImage = PlaceHolderImages.find(p => p.id === 'course-civil')!.imageUrl;
const bbaImage = PlaceHolderImages.find(p => p.id === 'course-bba')!.imageUrl;

export const courses: Course[] = [
  { id: '1', name: 'Computer Science Notes', slug: 'cs-notes', imageUrl: csImage },
  { id: '2', name: 'Mechanical Engineering', slug: 'mech-eng', imageUrl: mechImage },
  { id: '3', name: 'Civil Engineering', slug: 'civil-eng', imageUrl: civilImage },
  { id: '4', name: 'Business Administration', slug: 'bba', imageUrl: bbaImage },
];

export const semesters: Semester[] = [
  { id: '1', name: '1st Semester', slug: '1st-sem' },
  { id: '2', name: '2nd Semester', slug: '2nd-sem' },
  { id: '3', name: '3rd Semester', slug: '3rd-sem' },
  { id: '4', name: '4th Semester', slug: '4th-sem' },
];

export const chapters: Chapter[] = [
  { id: 'ch1', courseId: '1', semesterId: '1', title: 'Introduction to Programming', slug: 'intro-to-programming', description: '<p>This chapter covers the fundamentals of programming using a modern language. Topics include variables, data types, control structures, and basic syntax.</p>', pdfUrl: '#' },
  { id: 'ch2', courseId: '1', semesterId: '1', title: 'Data Structures', slug: 'data-structures', description: '<p>An in-depth look at fundamental data structures. You will learn about arrays, linked lists, stacks, and queues, and how to implement them.</p>' },
  { id: 'ch3', courseId: '1', semesterId: '2', title: 'Algorithms', slug: 'algorithms', description: '<p>Explore common algorithms for sorting, searching, and graph traversal. Understand algorithm complexity and performance analysis.</p>', pdfUrl: '#' },
  { id: 'ch4', courseId: '2', semesterId: '1', title: 'Engineering Mechanics', slug: 'engineering-mechanics', description: '<p>Core principles of statics, dynamics, and mechanics of materials. Essential for all mechanical engineers.</p>' },
];

export const units: Unit[] = [
  { id: 'u1-1', chapterId: 'ch1', title: 'Variables and Data Types', slug: 'variables', content: '<h1>Unit 1: Variables and Data Types</h1><p>In programming, a variable is a storage location paired with an associated symbolic name, which contains some known or unknown quantity of information referred to as a value. This unit will explore primitive and complex data types.</p>' },
  { id: 'u1-2', chapterId: 'ch1', title: 'Control Flow', slug: 'control-flow', content: '<h1>Unit 2: Control Flow</h1><p>Control flow is the order in which individual statements, instructions or function calls of an imperative program are executed or evaluated. This includes conditional statements (if-else) and loops (for, while).</p>' },
  { id: 'u2-1', chapterId: 'ch2', title: 'Arrays and Lists', slug: 'arrays', content: '<h1>Unit 1: Arrays and Lists</h1><p>This unit introduces array data structures, discussing their properties, operations, and use cases in detail.</p>' },
  { id: 'u3-1', chapterId: 'ch3', title: 'Sorting Algorithms', slug: 'sorting', content: '<h1>Unit 1: Sorting Algorithms</h1><p>Learn about various sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort. We will analyze their time and space complexity.</p>'},
];

// Data fetching functions
export const getCourses = async (): Promise<Course[]> => courses;
export const getCourseBySlug = async (slug: string): Promise<Course | undefined> => courses.find(c => c.slug === slug);
export const getCourseById = async (id: string): Promise<Course | undefined> => courses.find(c => c.id === id);

export const getSemesters = async (): Promise<Semester[]> => semesters;
export const getSemesterBySlug = async (slug: string): Promise<Semester | undefined> => semesters.find(s => s.slug === slug);
export const getSemesterById = async (id: string): Promise<Semester | undefined> => semesters.find(s => s.id === id);


export const getSemestersForCourse = async (courseId: string): Promise<Semester[]> => {
  const relevantChapters = chapters.filter(c => c.courseId === courseId);
  const semesterIds = [...new Set(relevantChapters.map(c => c.semesterId))];
  return semesters.filter(s => semesterIds.includes(s.id));
};

export const getChaptersForSemester = async (courseId: string, semesterId: string): Promise<Chapter[]> => {
  return chapters.filter(c => c.courseId === courseId && c.semesterId === semesterId);
};
export const getChapters = async (): Promise<Chapter[]> => chapters;
export const getChapterBySlug = async (slug: string): Promise<Chapter | undefined> => chapters.find(c => c.slug === slug);
export const getChapterById = async (id: string): Promise<Chapter | undefined> => chapters.find(c => c.id === id);


export const getUnitsForChapter = async (chapterId: string): Promise<Unit[]> => {
    return units.filter(u => u.chapterId === chapterId);
};
export const getUnits = async (): Promise<Unit[]> => units;
export const getUnitBySlug = async (slug:string, chapterId:string): Promise<Unit | undefined> => units.find(u => u.slug === slug && u.chapterId === chapterId);
export const getUnitById = async (id: string): Promise<Unit | undefined> => units.find(u => u.id === id);

