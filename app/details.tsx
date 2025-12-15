
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import { useAuthSession } from "@/providers/authctx";
import { useTasks } from "../context/TaskContext";
import { PostComment, createComment } from "@/api/commentApi";
import { ScrollView } from "react-native";


export default function DugnadDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const { tasks, joinTask, leaveTask, likeTask, unlikeTask } = useTasks();
  const { user } = useAuthSession();

  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const id = params.id as string | undefined;
  const task = tasks.find((t) => t.id === id);

  if (!id || !task) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Fant ikke dugnaden</Text>
        <MyButton title="Tilbake" onPress={() => router.back()} />
      </View>
    );
  }

  // KI-hjelp (kommentarlogikk):
  // Denne handleAddComment-funksjonen er strukturert med støtte fra ChatGPT:
  // - sjekke at bruker er innlogget før kommentering,
  // - trimme tekst og hoppe over tomme kommentarer,
  // - bygge et enkelt kommentarobjekt (forfatter, tekst, tidspunkt) som sendes til createComment
  //   i commentApi, og deretter oppdatere lokal React-state (comments) slik at kommentaren vises.
  async function handleAddComment() {
    if (!user) {
      alert("Du må være innlogget for å kommentere.");
      return;
    }

    const text = commentText.trim();
    if (!text) return;

    setIsSending(true);
    try {
      const newCommentBase = {
        authorId: user.uid,
        author: user.displayName ?? user.email ?? "Ukjent bruker",
        comment: text,
        createdAt: Date.now(),
      };

      if (!task) {
        console.error("Fant ikke dugnad ved publisering av kommentar");
        alert("Fant ikke dugnad.");
        return;
      }

      const newId = await createComment(task.id, newCommentBase);

      setComments((prev) => [...prev, { id: newId, ...newCommentBase }]);
      setCommentText("");
    } catch (error) {
      console.error("Kunne ikke legge til kommentar", error);
      alert("Kunne ikke legge til kommentar.");
    } finally {
      setIsSending(false);
    }
  }

  const userId = user?.uid ?? null;
  const participants = task.participants ?? [];
  const totalSpots = task.maxVolunteers;
  const usedSpots = participants.length;
  const spotsLeft =
    typeof totalSpots === "number" ? totalSpots - usedSpots : null;
  const likes = task.likes ?? [];
  const likeCount = likes.length;
  const [isLiking, setIsLiking] = useState(false);

  const hasLiked =
    userId != null ? likes.includes(userId) : false;


  const isParticipant =
    userId != null ? participants.includes(userId) : false;
  const isFull =
    typeof totalSpots === "number" ? usedSpots >= totalSpots : false;

  // KI-hjelp (påmelding/avmelding):
  // handleJoin og handleLeave er lagt opp med KI-støtte til flyten:
  // - sjekke at userId og joinTask/leaveTask finnes før vi kaller dem,
  // - bruke en lokal isBusy-state mens vi venter på asynkrone kall,
  // slik at mesteparten av logikken ligger i TaskContext, mens denne skjermen bare
  // trigget riktig funksjon.
  async function handleJoin() {
    if (!userId || !joinTask || !task) return;
    try {
      setIsBusy(true);
      await joinTask(task.id, userId);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleLeave() {
    if (!userId || !leaveTask || !task) return;
    try {
      setIsBusy(true);
      await leaveTask(task.id, userId);
    } finally {
      setIsBusy(false);
    }
  }

  // KI-hjelp (like/unlike):
  // handleToggleLike er laget med støtte fra ChatGPT:
  // - sjekke at bruker er innlogget og at dugnaden finnes,
  // - velge mellom likeTask og unlikeTask basert på hasLiked,
  // - bruke isLiking for å unngå at brukeren kan spam-klikke mens vi venter på Firestore.
  async function handleToggleLike() {
    if (!userId) {
      alert("Du må være innlogget for å like.");
      return;
    }

    if (!task) {
      console.error("Fant ikke dugnad ved toggling av like");
      alert("Fant ikke dugnad.");
      return;
    }

    try {
      setIsLiking(true);
      if (hasLiked) {
        if (typeof unlikeTask === "function") {
          await unlikeTask(task.id, userId);
        } else {
          console.warn("unlikeTask is not available");
        }
      } else {
        if (typeof likeTask === "function") {
          await likeTask(task.id, userId);
        } else {
          console.warn("likeTask is not available");
        }
      }
    } finally {
      setIsLiking(false);
    }
  }
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{task.title}</Text>
      {task.imageUrl && (
        <Image source={{ uri: task.imageUrl }} style={styles.coverImage} resizeMode="cover" />
      )}

      <Text style={styles.label}>Beskrivelse</Text>
      <Text style={styles.paragraph}>{task.description}</Text>

      <Text style={styles.label}>Påkrevde oppgaver</Text>
      <Text style={styles.muted}>
        {task.requiredTasks ?? "Ikke satt ennå"}
      </Text>

      <Text style={styles.label}>Sted</Text>
      <Text style={styles.muted}>{task.location ?? "Ikke satt ennå"}</Text>

      <Text style={styles.label}>Dato / tid</Text>
      <Text style={styles.muted}>{task.dateTime ?? "Ikke satt ennå"}</Text>

      <Text style={styles.label}>Kontaktperson</Text>
      <Text style={styles.muted}>
        {task.contactInfo ?? user?.email ?? "Ikke satt ennå"}
      </Text>

      <View style={styles.separator} />

      <Text style={styles.label}>Frivillige</Text>
      <Text style={styles.muted}>
        {typeof totalSpots === "number"
          ? `${usedSpots} av ${totalSpots} plasser fylt${
              spotsLeft !== null ? ` (${spotsLeft} ledig)` : ""
            }`
          : `${usedSpots} påmeldt`}
      </Text>

      <View style={styles.separator} />

      <View style={styles.likeRow}>
        <Text style={styles.muted}>
          {likeCount === 0
            ? "Ingen likerklikk ennå"
            : likeCount === 1
            ? "1 likerklikk"
            : `${likeCount} likerklikk`}
        </Text>

        {user && (
          <MyButton
            title={hasLiked ? "Fjern like" : "Like"}
            onPress={handleToggleLike}
            disabled={isLiking}
          />
        )}
      </View>

      <View style={styles.separator} />

      <Text style={styles.label}>Kommentarer</Text>

      {comments.length === 0 ? (
        <Text style={styles.muted}>
          Ingen kommentarer ennå. Bli den første til å kommentere!
        </Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 200 }}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{item.author}</Text>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.commentInputWrapper}>
        <TextInput
          style={styles.commentInput}
          placeholder="Skriv en kommentar..."
          value={commentText}
          onChangeText={setCommentText}
          placeholderTextColor="#999"
          multiline
        />
        <MyButton
          title={isSending ? "Sender..." : "Legg til"}
          onPress={handleAddComment}
          disabled={isSending}
        />
      </View>

      <View style={styles.buttonsRow}>
        <MyButton title="Tilbake" onPress={() => router.back()} />

        {user ? (
          isParticipant ? (
            <MyButton
              title={isBusy ? "Meldes av..." : "Meld meg av"}
              onPress={handleLeave}
              disabled={isBusy}
            />
          ) : (
            <MyButton
              title={isBusy ? "Meldes på..." : isFull ? "Fullt" : "Meld meg på"}
              onPress={handleJoin}
              disabled={isBusy || isFull}
            />
          )
        ) : null}
      </View>

      <View style={styles.buttonsRow}>
        <MyButton
          title="Rediger dugnad"
          onPress={() =>
            router.push({
              pathname: "/edit",
              params: {
                id: task.id,
                title: task.title,
                description: task.description,
              },
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FB",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  paragraph: {
    marginTop: 4,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  muted: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  buttonsRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  commentItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#444",
  },
  commentInputWrapper: {
    marginTop: 16,
    gap: 8,
  },
  commentInput: {
    minHeight: 60,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    textAlignVertical: "top",
  },
  likeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
});
