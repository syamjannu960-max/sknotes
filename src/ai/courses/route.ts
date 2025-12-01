import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "courses"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data });
  } catch (e) {
    if (e instanceof Error) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "An unknown error has occurred." }, { status: 500 });
  }
}
