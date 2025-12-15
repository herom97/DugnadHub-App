
import MyButton from "@/components/MyButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from "react-native";
import { useTasks } from "../context/TaskContext";
import { ScrollView } from "react-native";


export default function EditTaskScreen() {
  const { tasks, editTask, removeTask } = useTasks();
  const params = useLocalSearchParams();
  const router = useRouter();

  const id = params.id as string | undefined;
  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [location, setLocation] = useState(task?.location ?? "");
  const [dateTime, setDateTime] = useState(task?.dateTime ?? "");
  const [contactInfo, setContactInfo] = useState(task?.contactInfo ?? "");
  const [requiredTasks, setRequiredTasks] = useState(
    task?.requiredTasks ?? ""
  );

  if (!id || !task) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Fant ikke dugnaden</Text>
        <Button title="Tilbake" onPress={() => router.back()} />
      </ScrollView>
    );
  }

  async function handleSave() {
    if (!title.trim()) return;

    await editTask(id!, {
      title: title.trim(),
      description: description.trim(),
      location: location.trim() || undefined,
      dateTime: dateTime.trim() || undefined,
      contactInfo: contactInfo.trim() || undefined,
      requiredTasks: requiredTasks.trim() || undefined,
    });

    console.log("Navigerer tilbake fra edit");
    router.replace("/");
  }

  async function handleDelete() {
    await removeTask(id!);
    console.log("Navigerer tilbake etter sletting");
    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} 
    >
      <ScrollView contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Rediger oppdrag</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Sted"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Dato / tid"
          value={dateTime}
          onChangeText={setDateTime}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Kontaktinformasjon"
          value={contactInfo}
          onChangeText={setContactInfo}
          placeholderTextColor="#999"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Påkrevde oppgaver"
          value={requiredTasks}
          onChangeText={setRequiredTasks}
          multiline
          placeholderTextColor="#999"
        />

        <MyButton title="Lagre" onPress={handleSave} />

        <View style={{ marginTop: 10 }}>
          <MyButton title="Slett oppdrag" style={{backgroundColor:"#CC0000"}}  onPress={handleDelete} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 20,
    gap: 16,
    backgroundColor: "#F8F9FB",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
  },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: { height: 110, textAlignVertical: "top" },
});
