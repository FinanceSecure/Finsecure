import { Colors, Radius } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, compact && styles.compactIcon]}>
        <Ionicons name="analytics" size={compact ? 14 : 20} color={Colors.primary} />
      </View>
      <Text style={[styles.name, compact && styles.compactName]}>Midnight Capital</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.medium,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactIcon: {
    width: 26,
    height: 26,
    borderRadius: Radius.small,
  },
  name: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  compactName: {
    fontSize: 15,
  },
});
