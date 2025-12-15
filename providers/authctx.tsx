// KI-hjelp (ChatGPT, GPT-5.1 Thinking):
// Denne filen er skrevet og omstrukturert med støtte fra KI.
// Enkelte ting jeg fikk veiledning fra ChatGPT om :
// - sette opp en AuthSessionProvider rundt appen med React Context (createContext, useContext, useState),
// - bruke onAuthStateChanged fra Firebase til å lytte på innlogging/utlogging og mappe FirebaseUser til en enkel AuthUser-type,
// - eksponere signIn, signOut og createUser via en egen auth-context/hook (useAuthSession),
// - navigere brukeren til riktig skjerm etter innlogging ved å bruke router.replace("/").
// Jeg har brukt mønsteret vi har gått gjennom i forelesning (authctx-demoen med Firebase-auth)
// sammen med eksempler fra Firebase Authentication-dokumentasjonen for e-post/passord.
// Omtrentlig prompt til ChatGPT var:
// "Hjelp meg å lage en auth-context i React Native/Expo med TypeScript som bruker Firebase Authentication.
// Jeg vil ha en AuthSessionProvider som lytter på onAuthStateChanged, eksponerer signIn, signOut og createUser,
// og som navigerer brukeren til hovedskjermen etter innlogging."
// Svaret fra KI beskrev steg for steg hvordan context, typer, useEffect for onAuthStateChanged
// og handler-funksjoner kunne settes opp. Jeg har tilpasset navn, typer og navigasjon til denne appen.

import React from "react";

import { useRouter } from "expo-router";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthUser,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from "../api/authApi";
import { auth } from "../firebaseConfig";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createUser: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  userNameSession?: string | null;
  isLoading: boolean;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(user: FirebaseUser | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

export function useAuthSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider");
  }
  return value;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userNameSession, setUserNameSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // KI-hjelp:
  // Denne useEffect-blokken med onAuthStateChanged er satt opp med støtte fra ChatGPT.
  // Jeg ba om hjelp til å:
  // - registrere en lytter mot Firebase-auth,
  // - mappe FirebaseUser til AuthUser,
  // - lagre brukeren i state og markere når lastingen er ferdig.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const mapped = mapFirebaseUser(firebaseUser);
      console.log("onAuthStateChanged firebaseUser:", firebaseUser);
      console.log("onAuthStateChanged mapped:", mapped);

      setUser(mapped);
      setUserNameSession(mapped?.displayName ?? null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Etter at vi vet om bruker finnes, sender til forsiden
  useEffect(() => {
    if (isLoading) return;

    // Etter login/registrering hopper vi til hovedskjermen
    if (user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  async function handleSignIn(email: string, password: string) {
    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
    } catch (error) {
      const err = error as any;
      console.error("Kunne ikke logge inn", err?.code, err?.message);
      alert(`Kunne ikke logge inn: ${err?.code ?? "ukjent feil"}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateUser(
    email: string,
    password: string,
    displayName: string
  ) {
    try {
      setIsLoading(true);
      await signUpWithEmail(email, password, displayName);
    } catch (error) {
      const err = error as any;
      console.error("Kunne ikke logge inn", err?.code, err?.message);
      alert(`Kunne ikke logge inn: ${err?.code ?? "ukjent feil"}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      setIsLoading(true);
      await signOutUser();
    } catch (error) {
      console.error("Kunne ikke logge ut", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        createUser: handleCreateUser,
        userNameSession,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
