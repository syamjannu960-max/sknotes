
'use server';

import { db } from './firebase';
import type { Course, Semester, Subject, Unit, CourseWithId, SemesterWithId, SubjectWithId, UnitWithId } from './types';
import { collection, getDocs, query, where, doc, getDoc, documentId } from 'firebase/firestore';

const coursesCollection = 'courses';
const semestersCollection = 'semesters';
const subjectsCollection = 'subjects';
const unitsCollection = 'units';


// Data fetching functions
export async function getCourses(): Promise<CourseWithId[]> {
    const snapshot = await getDocs(collection(db, coursesCollection));
    return snapshot.docs.map(doc => ({ ...doc.data() as Course, id: doc.id }));
}

export async function getCourseBySlug(slug: string): Promise<CourseWithId | undefined> {
    const q = query(collection(db, coursesCollection), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Course, id: doc.id };
}

export async function getCourseById(id: string): Promise<CourseWithId | undefined> {
    const docRef = doc(db, coursesCollection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Course, id: docSnap.id };
}


export async function getSemesters(): Promise<SemesterWithId[]> {
    const snapshot = await getDocs(collection(db, semestersCollection));
    return snapshot.docs.map(doc => ({ ...doc.data() as Semester, id: doc.id }));
}

export async function getSemesterBySlug(slug: string): Promise<SemesterWithId | undefined> {
    const q = query(collection(db, semestersCollection), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Semester, id: doc.id };
}

export async function getSemesterById(id: string): Promise<SemesterWithId | undefined> {
    const docRef = doc(db, semestersCollection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Semester, id: docSnap.id };
}


export async function getSemestersForCourse(courseId: string): Promise<SemesterWithId[]> {
  const q = query(collection(db, subjectsCollection), where("courseId", "==", courseId));
  const snapshot = await getDocs(q);
  const semesterIds = [...new Set(snapshot.docs.map(doc => doc.data().semesterId))];
  
  if (semesterIds.length === 0) return [];

  const semestersQuery = query(collection(db, semestersCollection), where(documentId(), 'in', semesterIds));
  const semestersSnapshot = await getDocs(semestersQuery);
  return semestersSnapshot.docs.map(doc => ({ ...doc.data() as Semester, id: doc.id }));
};

export async function getSubjectsForSemester(courseId: string, semesterId: string): Promise<SubjectWithId[]> {
    const q = query(collection(db, subjectsCollection), where("courseId", "==", courseId), where("semesterId", "==", semesterId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() as Subject, id: doc.id }));
};

export async function getSubjects(): Promise<SubjectWithId[]> {
    const snapshot = await getDocs(collection(db, subjectsCollection));
    return snapshot.docs.map(doc => ({ ...doc.data() as Subject, id: doc.id }));
}

export async function getSubjectBySlug(slug: string): Promise<SubjectWithId | undefined> {
    const q = query(collection(db, subjectsCollection), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Subject, id: doc.id };
};

export async function getSubjectById(id: string): Promise<SubjectWithId | undefined> {
    const docRef = doc(db, subjectsCollection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Subject, id: docSnap.id };
};


export async function getUnitsForSubject(subjectId: string): Promise<UnitWithId[]> {
    const q = query(collection(db, unitsCollection), where("subjectId", "==", subjectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnits(): Promise<UnitWithId[]> {
    const snapshot = await getDocs(collection(db, unitsCollection));
    return snapshot.docs.map(doc => ({ ...doc.data() as Unit, id: doc.id }));
};

export async function getUnitBySlug(slug:string, subjectId:string): Promise<UnitWithId | undefined> {
    const q = query(collection(db, unitsCollection), where("slug", "==", slug), where("subjectId", "==", subjectId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { ...doc.data() as Unit, id: doc.id };
};
export async function getUnitById(id: string): Promise<UnitWithId | undefined> {
    const docRef = doc(db, unitsCollection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return { ...docSnap.data() as Unit, id: docSnap.id };
};
