import { Colors } from "@constants/theme";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text_muted,
        tabBarStyle: {
          backgroundColor: Colors.surfaceElevated,
          borderTopColor: Colors.border,
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
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
        name="addTransaction"
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color }) =>
            <Ionicons name="add-circle-sharp" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="investments"
        options={{
          title: "Investir",
          tabBarIcon: ({ color }) =>
            <FontAwesome6 name="money-bill-trend-up" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) =>
            <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
