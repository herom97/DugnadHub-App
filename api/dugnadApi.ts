
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export type Dugnad = {
  id: string;
  title: string;
  description: string;

  location?: string;
  dateTime?: string;
  contactInfo?: string;
  maxVolunteers?: number;
  participants?: string[];
  createdBy?: string;
  createdAt?: number;
  requiredTasks?: string;
  comments?: string[];
  likes?: string[];
  imageUrl?: string;
};

const dugnadCollection = collection(db, "dugnader");

export async function getDugnader(): Promise<Dugnad[]> {
  const snapshot = await getDocs(dugnadCollection);

  const dugnader: Dugnad[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<Dugnad, "id">;

    return {
      id: docSnap.id,
      title: data.title ?? "",
      description: data.description ?? "",
      location: data.location,
      dateTime: data.dateTime,
      contactInfo: data.contactInfo,
      maxVolunteers: data.maxVolunteers,
      participants: data.participants ?? [],
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      requiredTasks: data.requiredTasks,
      comments: data.comments ?? [],
      likes: data.likes ?? [],
      imageUrl: data.imageUrl,
    };
  });

  return dugnader;
}

function removeUndefined<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      clean[key] = value;
    }
  });

  return clean as T;
}

export async function createDugnad(
  partial: Omit<Dugnad, "id">
): Promise<string> {
  const data = removeUndefined({
    ...partial,
    createdAt: partial.createdAt ?? Date.now(),
    createdAtServer: serverTimestamp(),
  });

  const docRef = await addDoc(dugnadCollection, data);
  return docRef.id;
}

export async function updateDugnad(
  id: string,
  partial: Partial<Omit<Dugnad, "id">>
): Promise<void> {
  const ref = doc(db, "dugnader", id);
  const data = removeUndefined(partial);
  await updateDoc(ref, data);
}

export async function deleteDugnad(id: string): Promise<void> {
  const ref = doc(db, "dugnader", id);
  await deleteDoc(ref);
}
