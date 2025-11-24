
"use server";

import { revalidatePath } from "next/cache";
import { courses, semesters, chapters, units } from "./data";
import { slugify } from "./utils";
import { CourseFormValues, SemesterFormValues, ChapterFormValues, UnitFormValues } from "./schemas";

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Course Actions
export async function addCourse(values: CourseFormValues) {
    await delay(500);
    if (!values.name) {
        return { success: false, error: "Course name is required." };
    }
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
    const newSemester = { id: `s-${Date.now()}`, name: values.name, slug: slugify(values.name) };
    semesters.push(newSemester);
    revalidatePath("/admin/semesters");
    return { success: true, data: newSemester };
}

export async function updateSemester(values: SemesterFormValues) {
    await delay(500);
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
    const index = semesters.findIndex(s => s.id === id);
    if (index > -1) {
        semesters.splice(index, 1);
        revalidatePath("/admin/semesters");
        return { success: true };
    }
    return { success: false, error: "Semester not found" };
}

// Chapter Actions
export async function addChapter(values: ChapterFormValues) {
    await delay(500);
    const newChapter: Chapter = { 
        id: `ch-${Date.now()}`, 
        slug: slugify(values.title),
        ...values,
    };
    chapters.push(newChapter);
    revalidatePath("/admin/chapters");
    return { success: true, data: newChapter };
}

export async function updateChapter(values: ChapterFormValues) {
    await delay(500);
    if (!values.id) {
        return { success: false, error: "Chapter ID is required for an update." };
    }
    const chapter = chapters.find(c => c.id === values.id);
    if (chapter) {
        Object.assign(chapter, { ...values, slug: slugify(values.title) });
        revalidatePath("/admin/chapters");
        return { success: true, data: chapter };
    }
    return { success: false, error: "Chapter not found" };
}

export async function deleteChapter(id: string) {
    await delay(500);
    const index = chapters.findIndex(c => c.id === id);
    if (index > -1) {
        chapters.splice(index, 1);
        revalidatePath("/admin/chapters");
        return { success: true };
    }
    return { success: false, error: "Chapter not found" };
}

// Unit Actions
export async function addUnit(values: UnitFormValues) {
    await delay(500);
    const newUnit: Unit = { 
        id: `u-${Date.now()}`, 
        slug: slugify(values.title),
        ...values,
    };
    units.push(newUnit);
    revalidatePath("/admin/units");
    return { success: true, data: newUnit };
}

export async function updateUnit(values: UnitFormValues) {
    await delay(500);
    if (!values.id) {
        return { success: false, error: "Unit ID is required for an update." };
    }
    const unit = units.find(u => u.id === values.id);
    if (unit) {
        Object.assign(unit, { ...values, slug: slugify(values.title) });
        revalidatePath("/admin/units");
        return { success: true, data: unit };
    }
    return { success: false, error: "Unit not found" };
}

export async function deleteUnit(id: string) {
    await delay(500);
    const index = units.findIndex(u => u.id === id);
    if (index > -1) {
        units.splice(index, 1);
        revalidatePath("/admin/units");
        return { success: true };
    }
    return { success: false, error: "Unit not found" };
}
