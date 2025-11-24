
'use server';

import { adminDb } from './firebase-admin';
import type { Course, Semester, Subject, Unit, CourseWithId, SemesterWithId, SubjectWithId, UnitWithId } from './types';

const coursesCollection = 'courses';
const semestersCollection = 'semesters';
const subjectsCollection = 'subjects';
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
  const q = adminDb.collection(subjectsCollection).where("courseId", "==", courseId);
  const snapshot = await q.get();
  const semesterIds = [...new Set(snapshot.docs.map(doc => doc.data().semesterId))];
  
  if (semesterIds.length === 0) return [];

  const semestersQuery = adminDb.collection(semestersCollection).where(adminDb.FieldPath.documentId(), 'in', semesterIds);
  const semestersSnapshot = await semestersQuery.get();
  return semestersSnapshot.docs.map(doc => ({ ...doc.data() as Semester, id: doc.id }));
};

export async function getSubjectsForSemester(courseId: string, semesterId: string): Promise<SubjectWithId[]> {
    const q = adminDb.collection(subjectsCollection).where("courseId", "==", courseId).where("semesterId", "==", semesterId);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Subject, id: doc.id }));
};

export async function getSubjects(): Promise<SubjectWithId[]> {
    const snapshot = await adminDb.collection(subjectsCollection).get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Subject, id: doc.id }));
}

export async function getSubjectBySlug(slug: string): Promise<SubjectWithId | undefined> {
    const q = adminDb.collection(subjectsCollection).where("slug", "==", slug);
    const snapshot = await q.get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Subject, id: doc.id };
};

export async function getSubjectById(id: string): Promise<SubjectWithId | undefined> {
    const docRef = adminDb.collection(subjectsCollection).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return undefined;
    return { ...docSnap.data() as Subject, id: docSnap.id };
};


export async function getUnitsForSubject(subjectId: string): Promise<UnitWithId[]> {
    const q = adminDb.collection(unitsCollection).where("subjectId", "==", subjectId);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnits(): Promise<UnitWithId[]> {
    const snapshot = await adminDb.collection(unitsCollection).get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnitBySlug(slug:string, subjectId:string): Promise<UnitWithId | undefined> {
    const q = adminDb.collection(unitsCollection).where("slug", "==", slug).where("subjectId", "==", subjectId);
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

export async function getChapters(): Promise<SubjectWithId[]> {
    const snapshot = await adminDb.collection(subjectsCollection).get();
    return snapshot.docs.map(doc => ({ ...doc.data() as Subject, id: doc.id }));
}

export async function getChapterBySlug(slug: string): Promise<SubjectWithId | undefined> {
    return getSubjectBySlug(slug);
};

export async function getUnitsForChapter(chapterId: string): Promise<UnitWithId[]> {
    return getUnitsForSubject(chapterId);
}
