

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthSession } from "@/providers/authctx";

export default function AuthenticationScreen() {
  const { signIn, createUser, isLoading } = useAuthSession();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (isRegisterMode) {
      await createUser(userEmail.trim(), password, displayName.trim());
    } else {
      await signIn(userEmail.trim(), password);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegisterMode ? "Registrer ny bruker" : "Logg inn"}
      </Text>

      {isRegisterMode && (
        <View style={styles.field}>
          <Text style={styles.label}>Navn</Text>
          <Text style={styles.label}>Navn</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
            placeholder="Navn"
            placeholderTextColor="#9ca3af"
          />
        </View>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>E-post</Text>
        <TextInput
          value={userEmail}
          onChangeText={setUserEmail}
          style={styles.input}
          placeholder="epost@example.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Passord</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Passord"
          placeholderTextColor="#9ca3af"
          secureTextEntry
        />
      </View>

      <Pressable
        style={[styles.button, styles.primaryButton]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {isRegisterMode ? "Opprett bruker" : "Logg inn"}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => setIsRegisterMode((prev) => !prev)}
      >
        <Text style={styles.secondaryButtonText}>
          {isRegisterMode
            ? "Har du allerede en bruker? Logg inn"
            : "Ny bruker? Registrer deg"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F8F9FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#2563eb",
  },
});
