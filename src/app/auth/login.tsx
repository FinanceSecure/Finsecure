import { InputField } from "@components/atoms/InputField";
import LoadingAnimation from "@components/atoms/LoadingAnimation";
import { BrandMark } from "@/components/BrandMark";
import { Colors, Radius } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuthErrorMessage, useAuth } from "@/modules/auth/useAuth";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Atenção", "Informe e-mail e senha para entrar.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Atenção", "Informe um e-mail válido.");
      return;
    }

    try {
      setIsLoading(true);
      await login({
        email: email.trim().toLowerCase(),
        password,
      });
      router.replace("/(tabs)");
    } catch (error: unknown) {
      Alert.alert("Erro de Login", getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.authCard}>
        <View style={styles.brand}>
          <BrandMark />
        </View>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>ACESSO PRIVADO</Text>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Acesse sua conta para gerenciar seu patrimônio.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-MAIL</Text>
          <InputField
            placeholder="nome@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <Text style={styles.label}>SENHA</Text>
          <View style={styles.passwordWrapper}>
            <InputField
              placeholder="••••••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((current) => !current)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={18}
                color={Colors.text_muted}
              />
            </TouchableOpacity>
          </View>

          <LoadingAnimation
            isLoading={isLoading}
            onPress={handleLogin}
            buttonText="ENTRAR"
            buttonColor={Colors.primary}
            disabled={isLoading}
          />
        </View>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.footerText}>
            Ainda não possui acesso? <Text style={styles.link}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recoveryLink}
          onPress={() => Alert.alert(
            "Recuperação de senha",
            "Este fluxo será habilitado na próxima versão beta."
          )}
        >
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
  },
  authCard: {
    borderRadius: Radius.large,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
  },
  brand: {
    alignItems: "center",
    marginBottom: 32,
  },
  header: {
    marginBottom: 28,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.text_muted,
    marginTop: 6,
  },
  form: {
    gap: 10,
  },
  label: {
    color: Colors.text_muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 4,
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
    marginTop: 28,
    alignItems: "center",
  },
  footerText: {
    color: Colors.text_muted,
    fontSize: 12,
  },
  link: {
    color: Colors.link,
    fontWeight: "bold",
  },
  recoveryLink: {
    alignItems: "center",
    marginTop: 14,
  },
});
