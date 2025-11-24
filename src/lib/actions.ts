"use server";

import { revalidatePath } from "next/cache";
import { courses, semesters, chapters, units } from "./data";
import { slugify } from "./utils";

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Course Actions
export async function addCourse(name: string) {
    await delay(500);
    console.log("Adding course:", name);
    const newCourse = { id: `c-${Date.now()}`, name, slug: slugify(name), imageUrl: 'https://picsum.photos/seed/new/600/400' };
    courses.push(newCourse);
    revalidatePath("/admin/courses");
    return { success: true, data: newCourse };
}

export async function updateCourse(id: string, name: string) {
    await delay(500);
    console.log("Updating course:", id, name);
    const course = courses.find(c => c.id === id);
    if (course) {
        course.name = name;
        course.slug = slugify(name);
        revalidatePath("/admin/courses");
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
        return { success: true };
    }
    return { success: false, error: "Course not found" };
}


// Semester Actions
export async function addSemester(name: string) {
    await delay(500);
    console.log("Adding semester:", name);
    const newSemester = { id: `s-${Date.now()}`, name, slug: slugify(name) };
    semesters.push(newSemester);
    revalidatePath("/admin/semesters");
    return { success: true, data: newSemester };
}

export async function updateSemester(id: string, name: string) {
    await delay(500);
    console.log("Updating semester:", id, name);
    const semester = semesters.find(s => s.id === id);
    if (semester) {
        semester.name = name;
        semester.slug = slugify(name);
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
