
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthSession } from "@/providers/authctx";
import { Button } from "react-native";
import { ScrollView } from "react-native";

export default function AboutScreen() {
  const { signOut } = useAuthSession(); 
  return (
    <ScrollView style={styles.container} >
      <Text style={styles.header}>Om appen</Text>

      <Text style={styles.paragraph}>
        DugnadHub er en enkel oppgavehåndteringsapp laget med Expo og React Native. 
        Den lar brukere opprette, redigere og slette dugnadsoppdrag på en oversiktlig måte.
        I tillegg kan brukere melde seg på og av oppdrag, samt se hvem som deltar.
      </Text>

      <Text style={styles.subheader}>Teknologi som er brukt</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• React Native + Expo</Text>
        <Text style={styles.listItem}>• Expo Router (navigasjon)</Text>
        <Text style={styles.listItem}>• Context API (state management)</Text>
        <Text style={styles.listItem}>• Egne komponenter (Card)</Text>
      </View>

      <Text style={styles.subheader}>Funksjoner</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• Opprette nye oppdrag</Text>
        <Text style={styles.listItem}>• Redigere eksisterende oppdrag</Text>
        <Text style={styles.listItem}>• Slette oppdrag</Text>
        <Text style={styles.listItem}>• Moderne og enkel UI</Text>
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
  subheader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  list: {
    gap: 6,
  },
  listItem: {
    fontSize: 15,
    color: "#333",
  },
  footer: {
    marginTop: 40,
    fontSize: 13,
    color: "#777",
  },
});
