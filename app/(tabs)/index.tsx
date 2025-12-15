// KI-hjelp (ChatGPT, GPT-5.1 Thinking):
// - Gjelder HomeScreen-komponenten under (hele denne filen etter import-linjene).
// - Jeg brukte ChatGPT som støtte til å:
//   • sette opp innloggingssjekk med useAuthSession, slik at bare innloggede brukere ser dugnadsliste,
//     og andre får en enkel beskjed med knapp som sender dem til /authentication,
//   • koble FlatList mot TaskContext (tasks) og navigere videre til detaljer med router.push("/details"),
//   • lage et enkelt søkefelt (TextInput) med useState + useMemo som filtrerer på tittel og sted.
// - Struktur og navngivning er inspirert av liste- og detaljvisningen fra forelesningsprosjektet
//   (for eksempel PostList/PostDetails og bruken av Context/Router der), samt pensum i TDS200 om
//   Context API, Expo Router-navigasjon og enkel filtrering i React Native.
// - Prompten jeg brukte var omtrent: 
//   «Hjelp meg å lage en HomeScreen for dugnader som bruker TaskContext for data, Expo Router for
//   navigasjon til en detaljer-side, krever at brukeren er innlogget via useAuthSession, og har et
//   søkefelt som filtrerer på tittel og sted.»

import MyButton from "@/components/MyButton";
import { Text, View } from "@/components/Themed";
import { useAuthSession } from "@/providers/authctx";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/Card";
import { useTasks } from "../../context/TaskContext";

export default function HomeScreen() {
  const { tasks } = useTasks();
  const { user, isLoading } = useAuthSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tasks;

    return tasks.filter((t) => {
      const title = t.title?.toLowerCase() ?? "";
      const location = t.location?.toLowerCase() ?? "";
      return title.includes(q) || location.includes(q);
    });
  }, [tasks, query]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Du må være innlogget for å se dugnader.</Text>
        <Pressable 
          onPress={() => router.replace("/authentication")}
          style={{ 
            marginTop: 20, 
            padding: 10, 
            backgroundColor: "#007AFF", 
            borderRadius: 5 
          }}
        >
          <Text style={{ color: "#fff" }}>
            Gå til innlogging
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        
        {/* Header */}
        <Text style={styles.header}>Mine oppdrag</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Søk på tittel eller sted..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#999"
        />

        {/* Liste */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const used = item.participants?.length ?? 0;
            const total = item.maxVolunteers;
            const capacityText =
              typeof total === "number"
                ? `${used} av ${total} plasser fylt`
                : `${used} påmeldt`;

            return (
              <View style={styles.cardWrapper}>
                <Card
                  title={item.title}
                  description={item.description}
                  likeCount={item.likes?.length ?? 0}
                  imageUrl={item.imageUrl ?? null}
                  onPress={() =>
                    router.push({
                      pathname: "/details",
                      params: {
                        id: item.id,
                      },
                    })
                  }
                />
                <Text style={styles.capacityText}>{capacityText}</Text>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.buttonWrapper}>
          <View style={styles.buttonWrapper}>
            <MyButton
              title="➕ Nytt oppdrag"
              onPress={() => router.push("/create")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  capacityText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 12,
  },  

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,    
    backgroundColor: "#F8F9FB",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
  },

  buttonWrapper: {
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#F8F9FB"
  },

  listContent: {
    paddingBottom: 40,
  },

  cardWrapper: {
    marginBottom: 16,   
    backgroundColor: "#F8F9FB"
  },

  MyButton: {
    backgroundColor: "rgba(255, 81, 0, 1)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  MyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
