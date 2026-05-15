import { Colors } from "@constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface SettingGroupProps {
  title: string;
  children: React.ReactNode;
}

export const SettingGroup = ({ title, children }: SettingGroupProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text_muted,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
