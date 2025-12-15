
//   er basert på dette KI-forslaget.

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export type PostComment = {
  id: string;
  authorId: string;
  author: string;
  comment: string;
  createdAt?: number;
};

const commentsCollection = collection(db, "comments");

export async function createComment(
  dugnadId: string,
  comment: Omit<PostComment, "id">
): Promise<string> {
  // 1) Lagre kommentar i egen collection
  const docRef = await addDoc(commentsCollection, {
    authorId: comment.authorId,
    author: comment.author,
    comment: comment.comment,
    createdAt: comment.createdAt ?? Date.now(),
  });

  // 2) Legg ID til i dugnaden sitt comments-felt
  const dugnadRef = doc(db, "dugnader", dugnadId);
  await updateDoc(dugnadRef, {
    comments: arrayUnion(docRef.id),
  });

  return docRef.id;
}

export async function getCommentsByIds(
  ids: string[]
): Promise<PostComment[]> {
  if (ids.length === 0) return [];

  const results: PostComment[] = [];

  for (const id of ids) {
    const ref = doc(db, "comments", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as Omit<PostComment, "id">;
      results.push({
        id: snap.id,
        authorId: data.authorId,
        author: data.author,
        comment: data.comment,
        createdAt: data.createdAt,
      });
    }
  }

  return results;
}

export async function deleteComment(
  dugnadId: string,
  commentId: string
): Promise<void> {
  const commentRef = doc(db, "comments", commentId);
  await deleteDoc(commentRef);

  const dugnadRef = doc(db, "dugnader", dugnadId);
  await updateDoc(dugnadRef, {
    comments: arrayRemove(commentId),
  });
}
