import { Colors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export const ProfileHeader = ({ name, email }: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={80} color={Colors.primary} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name || "Usuário"}</Text>
        <Text style={styles.email}>{email || "email@example.com"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatarContainer: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: Colors.surface,
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.text_muted,
  },
});
