import { InputField } from "@/components/InputField";
import { Colors } from "@/constants/theme";
import { AuthService } from "@/services/authService";
import { AuthResponse } from "@/types/AuthTypes";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Cadastrar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginRedirect = () => router.push("/auth/login");
  const validarCampos = () => {
    if (!nome.trim()) return "O nome é obrigatório.";
    if (!email.trim()) return "O e-mail é obrigatório.";
    if (!senha.trim()) return "A senha é obrigatória.";
    return null;
  }

  const handleCadastro = async () => {
    const erro = validarCampos();
    if (erro) return Alert.alert("Erro", erro);

    setIsLoading(true);
    try {
      const result: AuthResponse = await AuthService.cadastrar(
        email,
        senha,
        nome,
      );
      Alert.alert("Bem sucedido!", result.mensagem ||
        "Cadastro realizado com sucesso."
      );
      handleLoginRedirect();
    } catch (error: unknown) {
      const mensagem = error instanceof Error
        ? error.message
        : "Erro inesperado";
      Alert.alert("Erro", mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <InputField
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <InputField
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCadastro}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading
            ? "Cadastrando..."
            : "Cadastrar"
          }
        </Text>
      </TouchableOpacity>
      <View style={styles.linkArea}>
        <Text style={styles.textLinkArea}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={handleLoginRedirect}>
          <Text style={styles.link}> Faça login </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  button: {
    backgroundColor: Colors.primary,
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold"
  },
  linkArea: {
    flexDirection: "row",
    marginTop: 20,
  },
  textLinkArea: {
    color: Colors.text,
  },
  link: {
    color: Colors.link,
    fontWeight: "bold",
  }
});
