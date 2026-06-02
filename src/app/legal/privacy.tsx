import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Política de Privacidade</Text>
      </View>

      <Text style={styles.paragraph}>
        Esta tela reserva o espaço da política de privacidade da Midnight Capital.
        Antes da publicação, substitua este conteúdo pelo texto jurídico aprovado.
      </Text>
      <Text style={styles.paragraph}>
        O aplicativo armazena apenas o token necessário para manter a sessão no
        dispositivo. Dados financeiros são consultados pela API autenticada e não
        devem ser enviados a serviços externos sem uma finalidade informada.
      </Text>
      <Text style={styles.paragraph}>
        A exclusão da conta está disponível na tela de perfil e encerra a sessão
        local após a confirmação da remoção.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 52,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  paragraph: {
    color: Colors.text_muted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
});
