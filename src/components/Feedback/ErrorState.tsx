import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Não foi possível carregar os dados. Verifique sua conexão.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
    backgroundColor: Colors.background,
  },
  message: {
    color: Colors.text_muted,
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    borderRadius: 8,
    backgroundColor: Colors.button,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: "700",
  },
});
