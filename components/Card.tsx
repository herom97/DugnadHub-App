
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type CardProps = {
  title: string;
  description: string;
  onPress: () => void;
  likeCount?: number;
  imageUrl?: string | null;
};

export default function Card({
  title,
  description,
  onPress,
  likeCount,
  imageUrl,
}: CardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {typeof likeCount === "number" && (
        <Text style={styles.meta}>
          {likeCount === 1 ? "1 likerklikk" : `${likeCount} likerklikk`}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  meta: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#eee",
  },
});
