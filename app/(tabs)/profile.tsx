// KI-hjelp (ChatGPT, GPT-5.1 Thinking):
// - Gjelder ProfileScreen-komponenten under (etter import-linjene).
// - Jeg brukte ChatGPT som støtte til å sette opp en enkel "Min side"-skjerm inspirert av profilsiden
//   i Kryssplattform-demoprosjektet, der useAuthSession brukes for å vise innlogget bruker og signOut
//   brukes til å logge ut.
// - Jeg fikk også hjelp til å bruke useMemo sammen med TaskContext (tasks) for å filtrere frem bare dugnader
//   der brukeren er påmeldt (participants inkluderer userId), og presentere dette som både et antall og
//   en liten liste med tittel, sted og dato/tid.
// - Layout og styling (seksjoner, overskrifter og enkel liste) er laget i samme enkle stil som resten av appen,
//   med utgangspunkt i forelesningsprosjektet, men tilpasset min egen tekst og struktur.
// - Prompten jeg brukte var omtrent: «Hjelp meg å lage en Min side / profilskjerm som viser innlogget bruker,
//   hvor mange dugnader brukeren er påmeldt i, en liste over disse dugnadene, og en Logg ut-knapp, basert på
//   måten profilsiden er gjort i kryssplattform-demokoden vår.»

import { useAuthSession } from "@/providers/authctx";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTasks } from "../../context/TaskContext";
import { ScrollView } from "react-native";
import { Button } from "react-native";

export default function ProfileScreen() {
  const { signOut } = useAuthSession(); 
  const { user } = useAuthSession();
  const { tasks } = useTasks();

  const userId = user?.uid ?? null;

  const myTasks = useMemo(() => {
    if (!userId) return [];
    return tasks.filter((t) => t.participants?.includes(userId));
  }, [tasks, userId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Min side</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Innlogget som</Text>
        <Text style={styles.value}>
          {user?.displayName || user?.email || "Ukjent bruker"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Deltakelse</Text>
        <Text style={styles.value}>
          Du er påmeldt i {myTasks.length} dugnad
          {myTasks.length === 1 ? "" : "er"}.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mine dugnader</Text>

        {myTasks.length === 0 ? (
          <Text style={styles.muted}>
            Du er ikke påmeldt i noen dugnader ennå.
          </Text>
        ) : (
          <FlatList
            data={myTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskMeta}>
                  {item.location ?? "Uten sted"}{" "}
                  {item.dateTime ? `• ${item.dateTime}` : ""}
                </Text>
              </View>
            )}
          />
        )}
      </View>
      <View style={styles.logoutWrapper}>
        <Button title="Logg ut" onPress={signOut} />
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
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#333",
  },
  muted: {
    fontSize: 14,
    color: "#777",
  },
  taskItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  taskMeta: {
    fontSize: 13,
    color: "#666",
  },
  logoutWrapper: {
    marginTop: 30,
    width: 100,
  },
});
