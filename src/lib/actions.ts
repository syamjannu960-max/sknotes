
"use server";

import { revalidatePath } from "next/cache";
import { courses, semesters, chapters, units } from "./data";
import { slugify } from "./utils";
import { CourseFormValues, SemesterFormValues } from "./schemas";

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Course Actions
export async function addCourse(values: CourseFormValues) {
    await delay(500);
    if (!values.name) {
        return { success: false, error: "Course name is required." };
    }
    console.log("Adding course:", values.name);
    const newCourse = { id: `c-${Date.now()}`, name: values.name, slug: slugify(values.name), imageUrl: 'https://picsum.photos/seed/new/600/400' };
    courses.push(newCourse);
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true, data: newCourse };
}

export async function updateCourse(values: CourseFormValues) {
    await delay(500);
    if (!values.id) {
        return { success: false, error: "Course ID is required for an update." };
    }
    console.log("Updating course:", values.id, values.name);
    const course = courses.find(c => c.id === values.id);
    if (course) {
        course.name = values.name;
        course.slug = slugify(values.name);
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        revalidatePath(`/courses/${course.slug}`);
        return { success: true, data: course };
    }
    return { success: false, error: "Course not found" };
}

export async function deleteCourse(id: string) {
    await delay(500);
    console.log("Deleting course:", id);
    const index = courses.findIndex(c => c.id === id);
    if (index > -1) {
        courses.splice(index, 1);
        revalidatePath("/admin/courses");
        revalidatePath("/courses");
        return { success: true };
    }
    return { success: false, error: "Course not found" };
}


// Semester Actions
export async function addSemester(values: SemesterFormValues) {
    await delay(500);
    console.log("Adding semester:", values.name);
    const newSemester = { id: `s-${Date.now()}`, name: values.name, slug: slugify(values.name) };
    semesters.push(newSemester);
    revalidatePath("/admin/semesters");
    return { success: true, data: newSemester };
}

export async function updateSemester(values: SemesterFormValues) {
    await delay(500);
    console.log("Updating semester:", values.id, values.name);
    const semester = semesters.find(s => s.id === values.id);
    if (semester) {
        semester.name = values.name;
        semester.slug = slugify(values.name);
        revalidatePath("/admin/semesters");
        return { success: true, data: semester };
    }
    return { success: false, error: "Semester not found" };
}

export async function deleteSemester(id: string) {
    await delay(500);
    console.log("Deleting semester:", id);
    const index = semesters.findIndex(s => s.id === id);
    if (index > -1) {
        semesters.splice(index, 1);
        revalidatePath("/admin/semesters");
        return { success: true };
    }
    return { success: false, error: "Semester not found" };
}

// NOTE: Chapter and Unit actions would follow a similar pattern.
// For brevity, they are omitted here but would be implemented similarly
// using the mock data arrays and revalidatePath.
