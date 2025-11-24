
"use server";

import { revalidatePath } from "next/cache";
import { slugify } from "./utils";
import { CourseFormValues, SemesterFormValues, SubjectFormValues, UnitFormValues } from "./schemas";
import { adminDb } from "./firebase-admin";

const success = (data?: any) => ({ success: true, data });
const error = (message: string) => ({ success: false, error: message });

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
        const docRef = await adminDb.collection("courses").add(newCourse);
        
        revalidatePath("/admin/courses");
        revalidatePath("/courses");

        return success({ ...newCourse, id: docRef.id });
    } catch (e: any) {
        console.error("addCourse action error:", e.message);
        return error("Failed to add course. " + e.message);
    }
}

export async function updateCourse(id: string, values: CourseFormValues) {
    try {
        if (!id) return error("Course ID is required for an update.");
        if (!values.name) return error("Course name is required.");

        const courseRef = adminDb.collection("courses").doc(id);
        const newSlug = slugify(values.name);
        const updatedCourse = { name: values.name, slug: newSlug };
        
        await courseRef.update(updatedCourse);
        
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        revalidatePath(`/courses/${newSlug}`);

        return success(updatedCourse);
    } catch (e: any) {
        console.error("updateCourse action error:", e.message);
        return error("Failed to update course. " + e.message);
    }
}

export async function deleteCourse(id: string) {
    try {
        if (!id) return error("Course ID is required for deletion.");
        await adminDb.collection("courses").doc(id).delete();
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        return success();
    } catch (e: any) {
        console.error("deleteCourse action error:", e.message);
        return error("Failed to delete course. " + e.message);
    }
}

// Semester Actions
export async function addSemester(values: SemesterFormValues) {
    try {
        if (!values.name) return error("Semester name is required.");
        const newSemester = { name: values.name, slug: slugify(values.name) };
        await adminDb.collection("semesters").add(newSemester);
        revalidatePath("/admin/semesters");
        return success(newSemester);
    } catch (e: any) {
        console.error("addSemester action error:", e.message);
        return error("Failed to add semester. " + e.message);
    }
}

export async function updateSemester(id: string, values: SemesterFormValues) {
    try {
        if (!id) return error("Semester ID is required for update.");
        if (!values.name) return error("Semester name is required.");
        const semesterRef = adminDb.collection("semesters").doc(id);
        const updatedSemester = { name: values.name, slug: slugify(values.name) };
        await semesterRef.update(updatedSemester);
        revalidatePath("/admin/semesters");
        return success(updatedSemester);
    } catch (e: any) {
        console.error("updateSemester action error:", e.message);
        return error("Failed to update semester. " + e.message);
    }
}

export async function deleteSemester(id: string) {
    try {
        if (!id) return error("Semester ID is required for deletion.");
        await adminDb.collection("semesters").doc(id).delete();
        revalidatePath("/admin/semesters");
        return success();
    } catch (e: any) {
        console.error("deleteSemester action error:", e.message);
        return error("Failed to delete semester. " + e.message);
    }
}

// Subject Actions
export async function addSubject(values: SubjectFormValues) {
    try {
        const newSubject = { 
            ...values,
            slug: slugify(values.title),
        };
        await adminDb.collection("subjects").add(newSubject);
        revalidatePath("/admin/subjects");
        return success(newSubject);
    } catch (e: any) {
        console.error("addSubject action error:", e.message);
        return error("Failed to add subject. " + e.message);
    }
}

export async function updateSubject(id: string, values: SubjectFormValues) {
    try {
        if (!id) return error("Subject ID is required for update.");
        const subjectRef = adminDb.collection("subjects").doc(id);
        const { id: _, ...updateData } = values; // Exclude id from update data
        const updatedSubject = { ...updateData, slug: slugify(values.title) };

        await subjectRef.update(updatedSubject);
        revalidatePath("/admin/subjects");
        return success(updatedSubject);
    } catch (e: any) {
        console.error("updateSubject action error:", e.message);
        return error("Failed to update subject. " + e.message);
    }
}

export async function deleteSubject(id: string) {
    try {
        if (!id) return error("Subject ID is required for deletion.");
        await adminDb.collection("subjects").doc(id).delete();
        revalidatePath("/admin/subjects");
        return success();
    } catch (e: any) {
        console.error("deleteSubject action error:", e.message);
        return error("Failed to delete subject. " + e.message);
    }
}

// Unit Actions
export async function addUnit(values: UnitFormValues) {
    try {
        const newUnit = { 
            ...values,
            slug: slugify(values.title),
        };
        await adminDb.collection("units").add(newUnit);
        revalidatePath("/admin/units");
        return success(newUnit);
    } catch (e: any) {
        console.error("addUnit action error:", e.message);
        return error("Failed to add unit. " + e.message);
    }
}

export async function updateUnit(id: string, values: UnitFormValues) {
    try {
        if (!id) return error("Unit ID is required for update.");
        const unitRef = adminDb.collection("units").doc(id);
        const { id: _, ...updateData } = values;
        const updatedUnit = { ...updateData, slug: slugify(values.title) };

        await unitRef.update(updatedUnit);
        revalidatePath("/admin/units");
        return success(updatedUnit);
    } catch (e: any) {
        console.error("updateUnit action error:", e.message);
        return error("Failed to update unit. " + e.message);
    }
}

export async function deleteUnit(id: string) {
    try {
        if (!id) return error("Unit ID is required for deletion.");
        await adminDb.collection("units").doc(id).delete();
        revalidatePath("/admin/units");
        return success();
    } catch (e: any) {
        console.error("deleteUnit action error:", e.message);
        return error("Failed to delete unit. " + e.message);
    }
}
