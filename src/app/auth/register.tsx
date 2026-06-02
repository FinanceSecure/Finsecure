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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos para criar sua conta.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Atenção", "Informe um e-mail válido.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Atenção", "A confirmação de senha não confere.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Atenção", "Aceite os termos de uso e a política de privacidade para continuar.");
      return;
    }

    if (
      password.length < 12
      || !/[A-Z]/.test(password)
      || !/[^A-Za-z0-9]/.test(password)
    ) {
      Alert.alert(
        "Atenção",
        "Use pelo menos 12 caracteres, uma letra maiúscula e um caractere especial."
      );
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
        <View style={styles.authCard}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <BrandMark compact />
          <View style={styles.header}>
            <Text style={styles.eyebrow}>NOVO ACESSO</Text>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Inicie sua jornada no mercado de capitais premium.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>NOME COMPLETO</Text>
            <InputField
              placeholder="Como deseja ser chamado?"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
            />

            <Text style={styles.label}>E-MAIL CORPORATIVO</Text>
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
                autoComplete="new-password"
                textContentType="newPassword"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((current) => !current)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={Colors.text_muted}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHint}>
              Use 12 caracteres, uma letra maiúscula e um caractere especial.
            </Text>

            <Text style={styles.label}>CONFIRMAR SENHA</Text>
            <View style={styles.passwordWrapper}>
              <InputField
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                textContentType="newPassword"
              />
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms((current) => !current)}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={13} color={Colors.background} />
                )}
              </View>
              <Text style={styles.termsText}>
                Li e aceito os Termos de Uso e a Política de Privacidade.
              </Text>
            </TouchableOpacity>

            <LoadingAnimation
              isLoading={isLoading}
              onPress={handleRegister}
              buttonText="CADASTRAR"
              buttonColor={Colors.primary}
              disabled={isLoading}
            />
          </View>

          <TouchableOpacity
            style={styles.footer}
            onPress={() => router.back()}
          >
            <Text style={styles.footerText}>
              Já possui acesso exclusivo? <Text style={styles.link}>Fazer login</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    justifyContent: "center",
  },
  authCard: {
    borderRadius: Radius.large,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 22,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.text_muted,
    textAlign: "left",
    marginTop: 8,
  },
  form: {
    gap: 10,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  label: {
    color: Colors.text_muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  passwordHint: {
    color: Colors.text_muted,
    fontSize: 11,
    lineHeight: 16,
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
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.input,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: {
    flex: 1,
    color: Colors.text_muted,
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    marginTop: 24,
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
});
