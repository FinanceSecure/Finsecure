import { Colors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AlertMessageProps {
  type: "error" | "success" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export const AlertMessage = ({ type, message, onClose }: AlertMessageProps) => {
  const colorMap = {
    error: Colors.error,
    success: Colors.success,
    warning: "#F59E0B",
    info: Colors.link,
  };

  const iconMap = {
    error: "alert-circle",
    success: "checkmark-circle",
    warning: "warning",
    info: "information-circle",
  };

  return (
    <View style={[styles.container, { borderLeftColor: colorMap[type] }]}>
      <View style={styles.content}>
        <Ionicons name={iconMap[type] as any} size={20} color={colorMap[type]} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {onClose && (
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={20} color={Colors.text_muted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    backgroundColor: Colors.surface,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
});
