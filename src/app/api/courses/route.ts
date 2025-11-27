
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: courses });
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to fetch courses." }, { status: 500 });
    }
}
