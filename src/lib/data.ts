import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Course, Semester, Chapter, Unit, CourseWithId, SemesterWithId, ChapterWithId, UnitWithId } from './types';

const coursesCollection = collection(db, 'courses');
const semestersCollection = collection(db, 'semesters');
const chaptersCollection = collection(db, 'chapters');
const unitsCollection = collection(db, 'units');

// Data fetching functions
export async function getCourses(): Promise<CourseWithId[]> {
    const snapshot = await getDocs(coursesCollection);
    return snapshot.docs.map(doc => ({ ...doc.data() as Course, id: doc.id }));
}

export async function getCourseBySlug(slug: string): Promise<CourseWithId | undefined> {
    const q = query(coursesCollection, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Course, id: doc.id };
}

export async function getCourseById(id: string): Promise<CourseWithId | undefined> {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Course, id: docSnap.id };
}


export async function getSemesters(): Promise<SemesterWithId[]> {
    const snapshot = await getDocs(semestersCollection);
    return snapshot.docs.map(doc => ({ ...doc.data() as Semester, id: doc.id }));
}

export async function getSemesterBySlug(slug: string): Promise<SemesterWithId | undefined> {
    const q = query(semestersCollection, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Semester, id: doc.id };
}

export async function getSemesterById(id: string): Promise<SemesterWithId | undefined> {
    const docRef = doc(db, 'semesters', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Semester, id: docSnap.id };
}


export async function getSemestersForCourse(courseId: string): Promise<SemesterWithId[]> {
  const q = query(chaptersCollection, where("courseId", "==", courseId));
  const snapshot = await getDocs(q);
  const semesterIds = [...new Set(snapshot.docs.map(doc => doc.data().semesterId))];
  
  if (semesterIds.length === 0) return [];

  const semestersQuery = query(semestersCollection, where('__name__', 'in', semesterIds));
  const semestersSnapshot = await getDocs(semestersQuery);
  return semestersSnapshot.docs.map(doc => ({ ...doc.data() as Semester, id: doc.id }));
};

export async function getChaptersForSemester(courseId: string, semesterId: string): Promise<ChapterWithId[]> {
    const q = query(chaptersCollection, where("courseId", "==", courseId), where("semesterId", "==", semesterId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() as Chapter, id: doc.id }));
};

export async function getChapters(): Promise<ChapterWithId[]> {
    const snapshot = await getDocs(chaptersCollection);
    return snapshot.docs.map(doc => ({ ...doc.data() as Chapter, id: doc.id }));
}

export async function getChapterBySlug(slug: string): Promise<ChapterWithId | undefined> {
    const q = query(chaptersCollection, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Chapter, id: doc.id };
};

export async function getChapterById(id: string): Promise<ChapterWithId | undefined> {
    const docRef = doc(db, 'chapters', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Chapter, id: docSnap.id };
};


export async function getUnitsForChapter(chapterId: string): Promise<UnitWithId[]> {
    const q = query(unitsCollection, where("chapterId", "==", chapterId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnits(): Promise<UnitWithId[]> {
    const snapshot = await getDocs(unitsCollection);
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnitBySlug(slug:string, chapterId:string): Promise<UnitWithId | undefined> {
    const q = query(unitsCollection, where("slug", "==", slug), where("chapterId", "==", chapterId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Unit, id: doc.id };
};
export async function getUnitById(id: string): Promise<UnitWithId | undefined> {
    const docRef = doc(db, 'units', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Unit, id: docSnap.id };
};
