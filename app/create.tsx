
import { uploadDugnadImage } from "@/api/imageApi";
import MyButton from "@/components/MyButton";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useTasks } from "../context/TaskContext";

export default function CreateTaskScreen() {
  const { addTask } = useTasks();
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [requiredTasks, setRequiredTasks] = useState("");

  async function handlePickImage() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Du må gi tilgang til bilder for å velge bilde.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Du må gi tilgang til kamera for å ta bilder.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleCreate() {
    if (!title.trim()) return;

    // parse maxVolunteers (valgfritt tall)
    let parsedMax: number | undefined = undefined;
    const trimmed = maxVolunteers.trim();

    if (trimmed.length > 0) {
      const n = Number(trimmed);
      if (!Number.isNaN(n)) {
        parsedMax = n;
      }
    }

    let imageUrl: string | undefined = undefined;
    if (imageUri) {
      try {
        imageUrl = await uploadDugnadImage(imageUri);
      } catch (error) {
        console.error("Kunne ikke laste opp bilde", error);
        alert(
          "Bildet ble ikke lastet opp, men dugnaden blir opprettet uten bilde."
        );
      }
    }

    await addTask({
      title: title.trim(),
      description: description.trim(),
      maxVolunteers: parsedMax,
      location: location.trim() || undefined,
      dateTime: dateTime.trim() || undefined,
      contactInfo: contactInfo.trim() || undefined,
      requiredTasks: requiredTasks.trim() || undefined,
      imageUrl,
    });

    setTitle("");
    setDescription("");
    setMaxVolunteers("");
    setLocation("");
    setDateTime("");
    setContactInfo("");
    setRequiredTasks("");
    setImageUri(null);

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Nytt dugnadsoppdrag</Text>

        <TextInput
          style={styles.input}
          placeholder="Tittel"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Beskrivelse"
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
          placeholder="Dato / tid (f.eks. 12.03 kl 18:00)"
          value={dateTime}
          onChangeText={setDateTime}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Kontaktinformasjon (navn/telefon/epost)"
          value={contactInfo}
          onChangeText={setContactInfo}
          placeholderTextColor="#999"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Påkrevde oppgaver (valgfritt)"
          value={requiredTasks}
          onChangeText={setRequiredTasks}
          multiline
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Maks antall frivillige (valgfritt)"
          value={maxVolunteers}
          onChangeText={setMaxVolunteers}
          keyboardType="number-pad"
          placeholderTextColor="#999"
        />

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        <MyButton title="Velg bilde" onPress={handlePickImage} />
        <MyButton title="Ta bilde" onPress={handleTakePhoto} />
        <MyButton title="Opprett" onPress={handleCreate} />

        {/* Litt ekstra luft nederst så knapper ikke klistrer seg i kanten */}
        <Text style={{ marginBottom: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F8F9FB",
    gap: 16, 
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#ddd",
  },
});
