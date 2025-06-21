"use server";

import {auth} from "@clerk/nextjs/server";
import { adminDb } from "./firebase-admin";
import { title } from "process";

export async function CreateNewDocument() {
    auth().protect();
    const {sessionClaims} = await auth();
    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc",
    });
    await adminDb.collection("users").doc(sessionClaims?.email!)
}