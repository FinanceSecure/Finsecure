import { Colors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#333",
          height: 65,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) =>
            <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="investments"
        options={{
          title: "Investir",
          tabBarIcon: ({ color }) =>
            <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
