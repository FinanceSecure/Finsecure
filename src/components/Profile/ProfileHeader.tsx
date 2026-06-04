import { Colors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface ProfileHeaderProps {
  name: string;
  subtitle?: string;
}

export const ProfileHeader = ({ name, subtitle }: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={34} color={Colors.primary} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name || "Usuário"}</Text>
        <Text style={styles.subtitle}>
          {subtitle || "Dados protegidos pelo FinanceSecure"}
        </Text>
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
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
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
  subtitle: {
    fontSize: 14,
    color: Colors.text_muted,
  },
});
