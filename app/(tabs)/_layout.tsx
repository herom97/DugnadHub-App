import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFIL",
        }}
      />
        <Tabs.Screen
          name="index"
          options={{
            title: "HJEM",
          }}
        />
      <Tabs.Screen
        name="about"
        options={{
          title: "OM APPEN",
        }}
      />
    </Tabs>
  );
}
