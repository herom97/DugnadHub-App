

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createDugnad,
  deleteDugnad,
  Dugnad,
  getDugnader,
  updateDugnad,
} from "../api/dugnadApi";

// Typen som resten av appen bruker.
export type Task = Dugnad;

export type AddTaskInput = {
  title: string;
  description: string;
  maxVolunteers?: number;
  location?: string;
  dateTime?: string;
  contactInfo?: string;
  requiredTasks?: string;
  imageUrl?: string;
};

export type EditTaskInput = {
  title: string;
  description: string;
  location?: string;
  dateTime?: string;
  contactInfo?: string;
  requiredTasks?: string;
};

type TaskContextType = {
  tasks: Task[];
  isLoading: boolean;
  refreshTasks: () => Promise<void>;

  addTask: (data: AddTaskInput) => Promise<void>;
  editTask: (id: string, data: EditTaskInput) => Promise<void>;
  removeTask: (id: string) => Promise<void>;

  joinTask?: (id: string, userId: string) => Promise<void>;
  leaveTask?: (id: string, userId: string) => Promise<void>;

  likeTask?: (id: string, userId: string) => Promise<void>;
  unlikeTask?: (id: string, userId: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function useTasks() {
  const value = useContext(TaskContext);
  if (!value) {
    throw new Error("useTasks must be used inside a TaskProvider");
  }
  return value;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // KI-hjelp:
  // Denne useEffect-blokken (kalle refreshTasks ved oppstart) er lagt opp
  // med støtte fra ChatGPT, med utgangspunkt i mønsteret fra PostContext i
  // forelesningsprosjektet (hente data fra Firestore når provider mountes).
  // 1) Hent dugnader ved oppstart
  useEffect(() => {
    refreshTasks();
  }, []);

  // Henter alle dugnader (beholdt slik jeg først fikk det til å fungere)
  async function refreshTasks() {
    try {
      setIsLoading(true);
      const data = await getDugnader();
      setTasks(data);
    } catch (error) {
      console.error("Kunne ikke hente dugnader", error);
    } finally {
      setIsLoading(false);
    }
  }

  // KI-hjelp:
  // addTask, editTask og removeTask er strukturert etter samme tankegang som create/update/delete
  // i PostContext fra forelesning, men tilpasset dugnader (inkludert felter som maxVolunteers, location, osv.).
  async function addTask(data: AddTaskInput) {
    try {
      console.log("addTask kalles med", data);

      const partial: Omit<Task, "id"> = {
        title: data.title,
        description: data.description,
        maxVolunteers: data.maxVolunteers ?? undefined,
        location: data.location,
        dateTime: data.dateTime,
        contactInfo: data.contactInfo,
        requiredTasks: data.requiredTasks,
        imageUrl: data.imageUrl ?? undefined,
        participants: [],
        likes: [],
        comments: [],
        createdAt: Date.now(),
      };

      const id = await createDugnad(partial);

      // Optimistisk oppdatering av UI (samme prinsipp som i demo-prosjektet).
      setTasks((prev) => [
        ...prev,
        {
          id,
          ...partial,
        },
      ]);
    } catch (error) {
      console.error("Kunne ikke opprette dugnad", error);
    }
  }

  async function likeTask(id: string, userId: string) {
    try {
      const current = tasks.find((t) => t.id === id);
      const existing = current?.likes ?? [];

      if (existing.includes(userId)) return;

      const updatedLikes = [...existing, userId];

      await updateDugnad(id, { likes: updatedLikes });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, likes: updatedLikes } : t
        )
      );
    } catch (error) {
      console.error("Kunne ikke like dugnad", error);
    }
  }

  async function unlikeTask(id: string, userId: string) {
    try {
      const current = tasks.find((t) => t.id === id);
      const existing = current?.likes ?? [];

      const updatedLikes = existing.filter((uid) => uid !== userId);

      await updateDugnad(id, { likes: updatedLikes });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, likes: updatedLikes } : t
        )
      );
    } catch (error) {
      console.error("Kunne ikke fjerne like", error);
    }
  }

  async function editTask(id: string, data: AddTaskInput) {
    try {
      console.log("editTask kalles med", id, data);

      const partial: Partial<Omit<Task, "id">> = {
        title: data.title,
        description: data.description,
        maxVolunteers: data.maxVolunteers ?? undefined,
        location: data.location,
        dateTime: data.dateTime,
        contactInfo: data.contactInfo,
        requiredTasks: data.requiredTasks,
        imageUrl: data.imageUrl ?? undefined,
      };

      await updateDugnad(id, partial);

      // Oppdater lokal state etter endring (samme mønster som fra forelesning).
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...partial } : task
        )
      );
    } catch (error) {
      console.error("Kunne ikke oppdatere dugnad", error);
    }
  }

  async function removeTask(id: string) {
    try {
      console.log("removeTask kalles med", id);

      await deleteDugnad(id);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Kunne ikke slette dugnad", error);
    }
  }

  // KI-hjelp:
  // joinTask og leaveTask er laget med støtte fra ChatGPT, basert på et lignende
  // "join/leave" mønster for arrays i Firestore (legge til/fjerne bruker-id i participants).
  // Jeg ba spesielt om hjelp til å håndtere maxVolunteers og å oppdatere local state
  // på en trygg måte.
  async function joinTask(id: string, userId: string) {
    try {
      console.log("joinTask kalles med", id, userId);

      const current = tasks.find((t) => t.id === id);
      if (!current) return;

      const alreadyIn = current.participants?.includes(userId) ?? false;
      if (alreadyIn) {
        console.log("Bruker er allerede påmeldt");
        return;
      }

      const currentParticipants = current.participants ?? [];
      const total = current.maxVolunteers;

      // Hvis vi har satt maxVolunteers, sjekk om det er fullt
      if (typeof total === "number" && currentParticipants.length >= total) {
        console.log("Dugnaden er full");
        return;
      }

      const updatedParticipants = [...currentParticipants, userId];

      await updateDugnad(id, { participants: updatedParticipants });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, participants: updatedParticipants } : t
        )
      );
    } catch (error) {
      console.error("Kunne ikke melde på bruker", error);
    }
  }

  async function leaveTask(id: string, userId: string) {
    try {
      console.log("leaveTask kalles med", id, userId);

      const current = tasks.find((t) => t.id === id);
      if (!current) return;

      const currentParticipants = current.participants ?? [];
      const updatedParticipants = currentParticipants.filter(
        (p) => p !== userId
      );

      await updateDugnad(id, { participants: updatedParticipants });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, participants: updatedParticipants } : t
        )
      );
    } catch (error) {
      console.error("Kunne ikke melde av bruker", error);
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        refreshTasks,
        addTask,
        editTask,
        removeTask,
        joinTask,
        leaveTask,
        likeTask,
        unlikeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
