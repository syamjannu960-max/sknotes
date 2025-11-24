
"use server";

import { revalidatePath } from "next/cache";
import { slugify } from "./utils";
import { CourseFormValues, SemesterFormValues, ChapterFormValues, UnitFormValues } from "./schemas";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Generic success and error handlers
const success = (data?: any) => ({ success: true, data });
const error = (message: string, details?: any) => {
    console.error(message, details);
    return { success: false, error: message };
};

// Course Actions
export async function addCourse(values: CourseFormValues) {
    try {
        if (!values.name) return error("Course name is required.");
        
        const slug = slugify(values.name);
        const newCourse = { 
            name: values.name, 
            slug: slug,
            imageUrl: `https://picsum.photos/seed/${slug}/600/400` 
        };
        const docRef = await addDoc(collection(db, "courses"), newCourse);
        
        revalidatePath("/admin/courses");
        revalidatePath("/courses");

        return success({ ...newCourse, id: docRef.id });
    } catch (e: any) {
        return error("Error adding course:", e.message);
    }
}

export async function updateCourse(id: string, values: CourseFormValues) {
    try {
        if (!id) return error("Course ID is required for an update.");
        if (!values.name) return error("Course name is required.");

        const courseRef = doc(db, "courses", id);
        const newSlug = slugify(values.name);
        const updatedCourse = { name: values.name, slug: newSlug };
        
        await updateDoc(courseRef, updatedCourse);
        
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        revalidatePath(`/courses/${newSlug}`);

        return success(updatedCourse);
    } catch (e: any) {
        return error("Error updating course:", e.message);
    }
}

export async function deleteCourse(id: string) {
    try {
        if (!id) return error("Course ID is required for deletion.");
        await deleteDoc(doc(db, "courses", id));
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        return success();
    } catch (e: any) {
        return error("Error deleting course:", e.message);
    }
}

// Semester Actions
export async function addSemester(values: SemesterFormValues) {
    try {
        if (!values.name) return error("Semester name is required.");
        const newSemester = { name: values.name, slug: slugify(values.name) };
        await addDoc(collection(db, "semesters"), newSemester);
        revalidatePath("/admin/semesters");
        return success(newSemester);
    } catch (e: any) {
        return error("Error adding semester:", e.message);
    }
}

export async function updateSemester(id: string, values: SemesterFormValues) {
    try {
        if (!id) return error("Semester ID is required for update.");
        if (!values.name) return error("Semester name is required.");
        const semesterRef = doc(db, "semesters", id);
        const updatedSemester = { name: values.name, slug: slugify(values.name) };
        await updateDoc(semesterRef, updatedSemester);
        revalidatePath("/admin/semesters");
        return success(updatedSemester);
    } catch (e: any) {
        return error("Error updating semester:", e.message);
    }
}

export async function deleteSemester(id: string) {
    try {
        if (!id) return error("Semester ID is required for deletion.");
        await deleteDoc(doc(db, "semesters", id));
        revalidatePath("/admin/semesters");
        return success();
    } catch (e: any) {
        return error("Error deleting semester:", e.message);
    }
}

// Chapter Actions
export async function addChapter(values: ChapterFormValues) {
    try {
        const newChapter = { 
            ...values,
            slug: slugify(values.title),
        };
        await addDoc(collection(db, "chapters"), newChapter);
        revalidatePath("/admin/chapters");
        return success(newChapter);
    } catch (e: any) {
        return error("Error adding chapter:", e.message);
    }
}

export async function updateChapter(id: string, values: ChapterFormValues) {
    try {
        if (!id) return error("Chapter ID is required for update.");
        const chapterRef = doc(db, "chapters", id);
        const updatedChapter = { ...values, slug: slugify(values.title) };
        // Remove id from the object to be updated to avoid Firestore errors
        const { id: _, ...updateData } = updatedChapter;
        await updateDoc(chapterRef, updateData);
        revalidatePath("/admin/chapters");
        return success(updatedChapter);
    } catch (e: any) {
        return error("Error updating chapter:", e.message);
    }
}

export async function deleteChapter(id: string) {
    try {
        if (!id) return error("Chapter ID is required for deletion.");
        await deleteDoc(doc(db, "chapters", id));
        revalidatePath("/admin/chapters");
        return success();
    } catch (e: any) {
        return error("Error deleting chapter:", e.message);
    }
}

// Unit Actions
export async function addUnit(values: UnitFormValues) {
    try {
        const newUnit = { 
            ...values,
            slug: slugify(values.title),
        };
        await addDoc(collection(db, "units"), newUnit);
        revalidatePath("/admin/units");
        return success(newUnit);
    } catch (e: any) {
        return error("Error adding unit:", e.message);
    }
}

export async function updateUnit(id: string, values: UnitFormValues) {
    try {
        if (!id) return error("Unit ID is required for update.");
        const unitRef = doc(db, "units", id);
        const updatedUnit = { ...values, slug: slugify(values.title) };
        // Remove id from the object to be updated to avoid Firestore errors
        const { id: _, ...updateData } = updatedUnit;
        await updateDoc(unitRef, updateData);
        revalidatePath("/admin/units");
        return success(updatedUnit);
    } catch (e: any) {
        return error("Error updating unit:", e.message);
    }
}

export async function deleteUnit(id: string) {
    try {
        if (!id) return error("Unit ID is required for deletion.");
        await deleteDoc(doc(db, "units", id));
        revalidatePath("/admin/units");
        return success();
    } catch (e: any) {
        return error("Error deleting unit:", e.message);
    }
}
