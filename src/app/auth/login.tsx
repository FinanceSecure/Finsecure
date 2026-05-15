import { InputField } from "@components/atoms/InputField";
import LoadingAnimation from "@components/atoms/LoadingAnimation";
import { Colors } from "@constants/theme";
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
      <View style={styles.header}>
        <Text style={styles.title}>FinSecure</Text>
        <Text style={styles.subtitle}>Gestão financeira inteligente</Text>
      </View>

      <View style={styles.form}>
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
            placeholder="Sua senha secreta"
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
              size={22}
              color={Colors.text_muted}
            />
          </TouchableOpacity>
        </View>

        <LoadingAnimation
          isLoading={isLoading}
          onPress={handleLogin}
          buttonText="ENTRAR"
          buttonColor={Colors.primary}
        />
      </View>

      <TouchableOpacity
        style={styles.footer}
        onPress={() => router.push("/auth/register")}
      >
        <Text style={styles.footerText}>
          Ainda não é membro? <Text style={styles.link}>Criar Conta</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 30,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text_muted,
    textAlign: "center",
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
