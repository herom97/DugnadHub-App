

import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";

// En enkel, "trygg" representasjon av brukeren vi kan bruke i UI
export type AuthUser = Pick<User, "uid" | "email" | "displayName">;

const mapUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
};

// Registrer ny bruker med e-post/passord (+ valgfritt displayName)
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }

  return mapUser(cred.user)!;
}

// Logg inn eksisterende bruker
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return mapUser(cred.user)!;
}

// Oppdater displayName for innlogget bruker
export async function updateUserDisplayName(
  displayName: string
): Promise<AuthUser | null> {
  if (!auth.currentUser) return null;

  await updateProfile(auth.currentUser, { displayName });
  return mapUser(auth.currentUser);
}

// Logg ut
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
