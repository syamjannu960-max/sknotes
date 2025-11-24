
"use server";

import { revalidatePath } from "next/cache";
import { slugify } from "./utils";
import { CourseFormValues, SemesterFormValues, ChapterFormValues, UnitFormValues } from "./schemas";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Course Actions
export async function addCourse(values: CourseFormValues) {
    try {
        if (!values.name) {
            return { success: false, error: "Course name is required." };
        }
        const newCourse = { name: values.name, slug: slugify(values.name), imageUrl: 'https://picsum.photos/seed/new/600/400' };
        await addDoc(collection(db, "courses"), newCourse);
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        return { success: true, data: newCourse };
    } catch (error) {
        return { success: false, error: "Failed to add course." };
    }
}

export async function updateCourse(id: string, values: CourseFormValues) {
    try {
        if (!id) {
            return { success: false, error: "Course ID is required for an update." };
        }
        const courseRef = doc(db, "courses", id);
        const updatedCourse = { name: values.name, slug: slugify(values.name) };
        await updateDoc(courseRef, updatedCourse);
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        revalidatePath(`/courses/${updatedCourse.slug}`);
        return { success: true, data: updatedCourse };
    } catch (error) {
        return { success: false, error: "Failed to update course." };
    }
}

export async function deleteCourse(id: string) {
    try {
        await deleteDoc(doc(db, "courses", id));
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete course." };
    }
}


// Semester Actions
export async function addSemester(values: SemesterFormValues) {
    try {
        const newSemester = { name: values.name, slug: slugify(values.name) };
        await addDoc(collection(db, "semesters"), newSemester);
        revalidatePath("/admin/semesters");
        return { success: true, data: newSemester };
    } catch (error) {
        return { success: false, error: "Failed to add semester." };
    }
}

export async function updateSemester(id: string, values: SemesterFormValues) {
    try {
        const semesterRef = doc(db, "semesters", id);
        const updatedSemester = { name: values.name, slug: slugify(values.name) };
        await updateDoc(semesterRef, updatedSemester);
        revalidatePath("/admin/semesters");
        return { success: true, data: updatedSemester };
    } catch (error) {
        return { success: false, error: "Failed to update semester." };
    }
}

export async function deleteSemester(id: string) {
    try {
        await deleteDoc(doc(db, "semesters", id));
        revalidatePath("/admin/semesters");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete semester." };
    }
}

// Chapter Actions
export async function addChapter(values: ChapterFormValues) {
    try {
        const newChapter = { 
            slug: slugify(values.title),
            ...values,
        };
        await addDoc(collection(db, "chapters"), newChapter);
        revalidatePath("/admin/chapters");
        return { success: true, data: newChapter };
    } catch (error) {
        return { success: false, error: "Failed to add chapter." };
    }
}

export async function updateChapter(id: string, values: ChapterFormValues) {
    try {
        if (!id) {
            return { success: false, error: "Chapter ID is required for an update." };
        }
        const chapterRef = doc(db, "chapters", id);
        const updatedChapter = { ...values, slug: slugify(values.title) };
        await updateDoc(chapterRef, updatedChapter);
        revalidatePath("/admin/chapters");
        return { success: true, data: updatedChapter };
    } catch (error) {
        return { success: false, error: "Failed to update chapter." };
    }
}

export async function deleteChapter(id: string) {
    try {
        await deleteDoc(doc(db, "chapters", id));
        revalidatePath("/admin/chapters");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete chapter." };
    }
}

// Unit Actions
export async function addUnit(values: UnitFormValues) {
    try {
        const newUnit = { 
            slug: slugify(values.title),
            ...values,
        };
        await addDoc(collection(db, "units"), newUnit);
        revalidatePath("/admin/units");
        return { success: true, data: newUnit };
    } catch (error) {
        return { success: false, error: "Failed to add unit." };
    }
}

export async function updateUnit(id: string, values: UnitFormValues) {
    try {
        if (!id) {
            return { success: false, error: "Unit ID is required for an update." };
        }
        const unitRef = doc(db, "units", id);
        const updatedUnit = { ...values, slug: slugify(values.title) };
        await updateDoc(unitRef, updatedUnit);
        revalidatePath("/admin/units");
        return { success: true, data: updatedUnit };
    } catch (error) {
        return { success: false, error: "Failed to update unit." };
    }
}

export async function deleteUnit(id: string) {
    try {
        await deleteDoc(doc(db, "units", id));
        revalidatePath("/admin/units");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete unit." };
    }
}
