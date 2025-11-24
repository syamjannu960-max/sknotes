
"use server";

import { revalidatePath } from "next/cache";
import { slugify } from "./utils";
import { CourseFormValues, SemesterFormValues, ChapterFormValues, UnitFormValues } from "./schemas";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getCourseBySlug } from "./data";

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
    } catch (error: any) {
        console.error("Error adding course: ", error);
        return { success: false, error: `Failed to add course: ${error.message}` };
    }
}

export async function updateCourse(id: string, values: CourseFormValues) {
    try {
        if (!id) {
            return { success: false, error: "Course ID is required for an update." };
        }
        const courseRef = doc(db, "courses", id);
        const newSlug = slugify(values.name);
        const updatedCourse = { name: values.name, slug: newSlug };
        await updateDoc(courseRef, updatedCourse);
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        const course = await getCourseBySlug(newSlug);
        if (course) {
            revalidatePath(`/courses/${course.slug}`);
        }
        return { success: true, data: updatedCourse };
    } catch (error: any) {
        console.error("Error updating course: ", error);
        return { success: false, error: `Failed to update course: ${error.message}` };
    }
}

export async function deleteCourse(id: string) {
    try {
        await deleteDoc(doc(db, "courses", id));
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting course: ", error);
        return { success: false, error: `Failed to delete course: ${error.message}` };
    }
}


// Semester Actions
export async function addSemester(values: SemesterFormValues) {
    try {
        const newSemester = { name: values.name, slug: slugify(values.name) };
        await addDoc(collection(db, "semesters"), newSemester);
        revalidatePath("/admin/semesters");
        return { success: true, data: newSemester };
    } catch (error: any) {
        console.error("Error adding semester: ", error);
        return { success: false, error: `Failed to add semester: ${error.message}` };
    }
}

export async function updateSemester(id: string, values: SemesterFormValues) {
    try {
        const semesterRef = doc(db, "semesters", id);
        const updatedSemester = { name: values.name, slug: slugify(values.name) };
        await updateDoc(semesterRef, updatedSemester);
        revalidatePath("/admin/semesters");
        return { success: true, data: updatedSemester };
    } catch (error: any) {
        console.error("Error updating semester: ", error);
        return { success: false, error: `Failed to update semester: ${error.message}` };
    }
}

export async function deleteSemester(id: string) {
    try {
        await deleteDoc(doc(db, "semesters", id));
        revalidatePath("/admin/semesters");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting semester: ", error);
        return { success: false, error: `Failed to delete semester: ${error.message}` };
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
    } catch (error: any) {
        console.error("Error adding chapter: ", error);
        return { success: false, error: `Failed to add chapter: ${error.message}` };
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
    } catch (error: any) {
        console.error("Error updating chapter: ", error);
        return { success: false, error: `Failed to update chapter: ${error.message}` };
    }
}

export async function deleteChapter(id: string) {
    try {
        await deleteDoc(doc(db, "chapters", id));
        revalidatePath("/admin/chapters");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting chapter: ", error);
        return { success: false, error: `Failed to delete chapter: ${error.message}` };
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
    } catch (error: any) {
        console.error("Error adding unit: ", error);
        return { success: false, error: `Failed to add unit: ${error.message}` };
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
    } catch (error: any) {
        console.error("Error updating unit: ", error);
        return { success: false, error: `Failed to update unit: ${error.message}` };
    }
}

export async function deleteUnit(id: string) {
    try {
        await deleteDoc(doc(db, "units", id));
        revalidatePath("/admin/units");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting unit: ", error);
        return { success: false, error: `Failed to delete unit: ${error.message}` };
    }
}
