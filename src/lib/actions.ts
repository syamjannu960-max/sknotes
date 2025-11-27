"use server";

import { revalidatePath } from "next/cache";
import { slugify } from "./utils";
import { CourseFormValues, SemesterFormValues, SubjectFormValues, UnitFormValues } from "./schemas";
import { db } from "./firebase";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Helpers
const success = (data?: any) => ({ success: true, data });
const error = (message: string) => ({ success: false, error: message });

// ===============================
// AUTH ACTIONS
// ===============================
export async function handleAdminLogin(prevState: any, formData: FormData) {
    try {
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        if (!username || !password) {
            return { success: false, message: "Username and password are required." };
        }

        const usersRef = collection(db, "users");
        const q = query(
            usersRef,
            where("username", "==", username),
            where("password", "==", password)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return { success: false, message: "Invalid username or password." };
        }

        const user = querySnapshot.docs[0].data();
        const cookieStore = await cookies(); 
        cookieStore.set(
            "session",
            JSON.stringify({
                username: user.username,
                isAdmin: true,
            }),
            {
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24,
                path: "/",
            }
        );

        return { success: true, message: "Login successful!" };
    } catch (e: any) {
        console.error("handleAdminLogin ERROR:", e);
        return { success: false, message: "Server error occurred." };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/admin/login");
}

// ===============================
// COURSE ACTIONS
// ===============================
export async function addCourse(values: CourseFormValues) {
    try {
        if (!values.name) return error("Course name is required.");

        const slug = slugify(values.name);
        const newCourse = {
            name: values.name,
            slug,
            imageUrl: `https://picsum.photos/seed/${slug}/600/400`,
        };

        const docRef = await addDoc(collection(db, "courses"), newCourse);

        revalidatePath("/admin/courses");
        revalidatePath("/courses");

        return success({ ...newCourse, id: docRef.id });
    } catch (e: any) {
        console.error("addCourse ERROR:", e);
        return error("Failed to add course.");
    }
}

export async function updateCourse(id: string, values: CourseFormValues) {
    try {
        if (!id) return error("Course ID is required.");
        if (!values.name) return error("Course name is required.");

        const slug = slugify(values.name);
        const updatedCourse = { name: values.name, slug };

        await updateDoc(doc(db, "courses", id), updatedCourse);

        revalidatePath("/admin/courses");

        return success(updatedCourse);
    } catch (e: any) {
        console.error("updateCourse ERROR:", e);
        return error("Failed to update course.");
    }
}

export async function deleteCourse(id: string) {
    try {
        if (!id) return error("Course ID is required.");

        await deleteDoc(doc(db, "courses", id));

        revalidatePath("/admin/courses");
        return success();
    } catch (e: any) {
        console.error("deleteCourse ERROR:", e);
        return error("Failed to delete course.");
    }
}

// ===============================
// SEMESTER ACTIONS
// ===============================
export async function addSemester(values: SemesterFormValues) {
    try {
        if (!values.name) return error("Semester name is required.");

        const newSemester = {
            name: values.name,
            slug: slugify(values.name),
        };

        await addDoc(collection(db, "semesters"), newSemester);

        revalidatePath("/admin/semesters");
        return success(newSemester);
    } catch (e: any) {
        console.error("addSemester ERROR:", e);
        return error("Failed to add semester.");
    }
}

export async function updateSemester(id: string, values: SemesterFormValues) {
    try {
        if (!id) return error("Semester ID is required.");

        const updatedSemester = {
            name: values.name,
            slug: slugify(values.name),
        };

        await updateDoc(doc(db, "semesters", id), updatedSemester);

        revalidatePath("/admin/semesters");
        return success(updatedSemester);
    } catch (e: any) {
        console.error("updateSemester ERROR:", e);
        return error("Failed to update semester.");
    }
}

export async function deleteSemester(id: string) {
    try {
        if (!id) return error("Semester ID is required.");

        await deleteDoc(doc(db, "semesters", id));

        revalidatePath("/admin/semesters");
        return success();
    } catch (e: any) {
        console.error("deleteSemester ERROR:", e);
        return error("Failed to delete semester.");
    }
}

// ===============================
// SUBJECT ACTIONS
// ===============================
export async function addSubject(values: SubjectFormValues) {
    try {
        const newSubject = {
            ...values,
            slug: slugify(values.title),
        };

        await addDoc(collection(db, "subjects"), newSubject);

        revalidatePath("/admin/subjects");
        return success(newSubject);
    } catch (e: any) {
        console.error("addSubject ERROR:", e);
        return error("Failed to add subject.");
    }
}

export async function updateSubject(id: string, values: SubjectFormValues) {
    try {
        if (!id) return error("Subject ID is required.");

        const updatedSubject = {
            ...values,
            slug: slugify(values.title),
        };

        await updateDoc(doc(db, "subjects", id), updatedSubject);

        revalidatePath("/admin/subjects");
        return success(updatedSubject);
    } catch (e: any) {
        console.error("updateSubject ERROR:", e);
        return error("Failed to update subject.");
    }
}

export async function deleteSubject(id: string) {
    try {
        if (!id) return error("Subject ID is required.");

        await deleteDoc(doc(db, "subjects", id));

        revalidatePath("/admin/subjects");
        return success();
    } catch (e: any) {
        console.error("deleteSubject ERROR:", e);
        return error("Failed to delete subject.");
    }
}

// ===============================
// UNIT ACTIONS
// ===============================
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
        console.error("addUnit ERROR:", e);
        return error("Failed to add unit.");
    }
}

export async function updateUnit(id: string, values: UnitFormValues) {
    try {
        if (!id) return error("Unit ID is required.");

        const updatedUnit = {
            ...values,
            slug: slugify(values.title),
        };

        await updateDoc(doc(db, "units", id), updatedUnit);

        revalidatePath("/admin/units");
        return success(updatedUnit);
    } catch (e: any) {
        console.error("updateUnit ERROR:", e);
        return error("Failed to update unit.");
    }
}

export async function deleteUnit(id: string) {
    try {
        if (!id) return error("Unit ID is required.");

        await deleteDoc(doc(db, "units", id));

        revalidatePath("/admin/units");
        return success();
    } catch (e: any) {
        console.error("deleteUnit ERROR:", e);
        return error("Failed to delete unit.");
    }
}
