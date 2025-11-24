'use server';

import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { adminDb } from './firebase-admin';
import type { Course, Semester, Chapter, Unit, CourseWithId, SemesterWithId, ChapterWithId, UnitWithId } from './types';

const coursesCollection = 'courses';
const semestersCollection = 'semesters';
const chaptersCollection = 'chapters';
const unitsCollection = 'units';


// Data fetching functions
export async function getCourses(): Promise<CourseWithId[]> {
    const snapshot = await adminDb.collection(coursesCollection).get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Course, id: doc.id }));
}

export async function getCourseBySlug(slug: string): Promise<CourseWithId | undefined> {
    const q = adminDb.collection(coursesCollection).where("slug", "==", slug);
    const snapshot = await q.get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Course, id: doc.id };
}

export async function getCourseById(id: string): Promise<CourseWithId | undefined> {
    const docRef = adminDb.collection(coursesCollection).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return undefined;
    return { ...docSnap.data() as Course, id: docSnap.id };
}


export async function getSemesters(): Promise<SemesterWithId[]> {
    const snapshot = await adminDb.collection(semestersCollection).get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Semester, id: doc.id }));
}

export async function getSemesterBySlug(slug: string): Promise<SemesterWithId | undefined> {
    const q = adminDb.collection(semestersCollection).where("slug", "==", slug);
    const snapshot = await q.get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Semester, id: doc.id };
}

export async function getSemesterById(id: string): Promise<SemesterWithId | undefined> {
    const docRef = adminDb.collection(semestersCollection).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return undefined;
    return { ...docSnap.data() as Semester, id: docSnap.id };
}


export async function getSemestersForCourse(courseId: string): Promise<SemesterWithId[]> {
  const q = adminDb.collection(chaptersCollection).where("courseId", "==", courseId);
  const snapshot = await q.get();
  const semesterIds = [...new Set(snapshot.docs.map(doc => doc.data().semesterId))];
  
  if (semesterIds.length === 0) return [];

  // Firestore 'in' queries are limited to 30 elements. If you expect more, consider a different approach.
  const semestersQuery = adminDb.collection(semestersCollection).where('__name__', 'in', semesterIds);
  const semestersSnapshot = await semestersQuery.get();
  return semestersSnapshot.docs.map(doc => ({ ...doc.data() as Semester, id: doc.id }));
};

export async function getChaptersForSemester(courseId: string, semesterId: string): Promise<ChapterWithId[]> {
    const q = adminDb.collection(chaptersCollection).where("courseId", "==", courseId).where("semesterId", "==", semesterId);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Chapter, id: doc.id }));
};

export async function getChapters(): Promise<ChapterWithId[]> {
    const snapshot = await adminDb.collection(chaptersCollection).get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Chapter, id: doc.id }));
}

export async function getChapterBySlug(slug: string): Promise<ChapterWithId | undefined> {
    const q = adminDb.collection(chaptersCollection).where("slug", "==", slug);
    const snapshot = await q.get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Chapter, id: doc.id };
};

export async function getChapterById(id: string): Promise<ChapterWithId | undefined> {
    const docRef = adminDb.collection(chaptersCollection).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return undefined;
    return { ...docSnap.data() as Chapter, id: docSnap.id };
};


export async function getUnitsForChapter(chapterId: string): Promise<UnitWithId[]> {
    const q = adminDb.collection(unitsCollection).where("chapterId", "==", chapterId);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnits(): Promise<UnitWithId[]> {
    const snapshot = await adminDb.collection(unitsCollection).get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnitBySlug(slug:string, chapterId:string): Promise<UnitWithId | undefined> {
    const q = adminDb.collection(unitsCollection).where("slug", "==", slug).where("chapterId", "==", chapterId);
    const snapshot = await q.get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Unit, id: doc.id };
};
export async function getUnitById(id: string): Promise<UnitWithId | undefined> {
    const docRef = adminDb.collection(unitsCollection).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return undefined;
    return { ...docSnap.data() as Unit, id: docSnap.id };
};
