import { InputField } from "@components/atoms/InputField";
import LoadingAnimation from "@components/atoms/LoadingAnimation";
import { Colors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuthErrorMessage, useAuth } from "@/modules/auth/useAuth";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos para criar sua conta.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      Alert.alert("Sucesso", "Sua conta foi criada. Agora você pode fazer login.");
      router.push("/auth/login");
    } catch (error: unknown) {
      Alert.alert("Erro no Cadastro", getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.scrollView}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao FinSecure e proteja seu futuro</Text>
        </View>

        <View style={styles.form}>
          <InputField
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textContentType="name"
          />

          <InputField
            placeholder="E-mail institucional"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <View style={styles.passwordWrapper}>
            <InputField
              placeholder="Crie uma senha forte"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((current) => !current)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={Colors.text_muted}
              />
            </TouchableOpacity>
          </View>

          <LoadingAnimation
            isLoading={isLoading}
            onPress={handleRegister}
            buttonText="CADASTRAR"
            buttonColor={Colors.primary}
          />
        </View>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.back()}
        >
          <Text style={styles.footerText}>
            Já possui uma conta? <Text style={styles.link}>Fazer Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  scrollView: {
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 30,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text_muted,
    textAlign: "left",
    marginTop: 8,
  },
  form: {
    gap: 20,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    zIndex: 1,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    color: Colors.text_muted,
  },
  link: {
    color: Colors.link,
    fontWeight: "bold",
  },
});
