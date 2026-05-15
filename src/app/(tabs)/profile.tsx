import { AlertMessage } from "@/components/Profile/AlertMessage";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { SettingGroup } from "@/components/Profile/SettingGroup";
import { SettingItem } from "@/components/Profile/SettingItem";
import { useAuth } from "@/modules/auth/useAuth";
import { useChangeEmail, useChangePassword, useDeleteAccount } from "@/modules/profile/useProfile";
import { Colors } from "@constants/theme";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [changeEmailVisible, setChangeEmailVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [emailForm, setEmailForm] = useState({ newEmail: "" });
  const changePasswordMutation = useChangePassword();
  const changeEmailMutation = useChangeEmail();
  const deleteAccountMutation = useDeleteAccount();

  useEffect(() => { }, [user]);

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setAlert({ type: "error", message: "Preencha todos os campos" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({ type: "error", message: "Senha deve ter pelo menos 6 caracteres" });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync(passwordForm);
      setAlert({ type: "success", message: "Senha alterada com sucesso!" });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setChangePasswordVisible(false);
    } catch {
      setAlert({ type: "error", message: "Erro ao alterar senha. Tente novamente." });
    }
  };

  const handleChangeEmail = async () => {
    if (!emailForm.newEmail) {
      setAlert({ type: "error", message: "Preencha o novo email" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      setAlert({ type: "error", message: "Email inválido" });
      return;
    }

    try {
      await changeEmailMutation.mutateAsync({ newEmail: emailForm.newEmail });
      setAlert({ type: "success", message: "Email alterado com sucesso!" });
      setEmailForm({ newEmail: "" });
      setChangeEmailVisible(false);
    } catch {
      setAlert({ type: "error", message: "Erro ao alterar email. Tente novamente." });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Deletar Conta",
      "Tem certeza? Esta ação é irreversível e todos os seus dados serão permanentemente removidos.",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("[ProfileScreen] Exclusão cancelada"),
          style: "cancel"
        },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await deleteAccountMutation.mutateAsync();
              setAlert({ type: "success", message: "Conta deletada com sucesso!" });
            } catch {
              setAlert({ type: "error", message: "Erro ao deletar conta. Tente novamente." });
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setAlert({ type: "error", message: "Erro ao fazer logout. Tente novamente." });
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {alert && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <ProfileHeader name={user?.name || "Usuário"} email={user?.userId || "usuario@email.com"} />

        <SettingGroup title="Segurança">
          <SettingItem
            icon="lock-closed"
            label="Alterar Senha"
            description="Atualize sua senha com segurança"
            onPress={() => {
              setChangePasswordVisible(true);
            }}
            isLoading={changePasswordMutation.isPending}
          />

          <SettingItem
            icon="shield-checkmark"
            label="Autenticação em 2 Fatores"
            description="Desativada"
            badge="EM BREVE"
            badgeColor={Colors.text_muted}
            disabled
          />
        </SettingGroup>

        <SettingGroup title="Preferências">
          <SettingItem
            icon="cash"
            label="Moeda"
            description="Real Brasileiro (BRL)"
            badge="R$"
            badgeColor={Colors.investimento}
            disabled
          />

          <SettingItem
            icon="notifications"
            label="Notificações"
            description="Gerencie seus alertas financeiros"
            badge="EM BREVE"
            badgeColor={Colors.text_muted}
            disabled
          />

          <SettingItem
            icon="moon"
            label="Tema"
            description="Escuro"
            disabled
          />
        </SettingGroup>

        <SettingGroup title="Conta">
          <SettingItem
            icon="mail"
            label="Alterar Email"
            description="Mude seu endereço de email"
            onPress={() => {
              setChangeEmailVisible(true);
            }}
            isLoading={changeEmailMutation.isPending}
          />

          <SettingItem
            icon="document-text"
            label="Política de Privacidade"
            description="Leia nossa política de dados"
            disabled
          />

          <SettingItem
            icon="information-circle"
            label="Sobre"
            description="Versão 1.0.0"
            disabled
          />

          <SettingItem
            icon="trash"
            label="Deletar Conta"
            description="Remover minha conta permanentemente"
            onPress={handleDeleteAccount}
            isLoading={deleteAccountMutation.isPending}
            badgeColor={Colors.error}
          />
        </SettingGroup>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={false}>
          <FontAwesome6 name="arrow-right-from-bracket" size={18} color="#fff" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>FinanceSecure v1.0.0</Text>
      </ScrollView>

      <Modal
        visible={changePasswordVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setChangePasswordVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Senha</Text>
              <TouchableOpacity onPress={() => setChangePasswordVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Senha Atual"
              placeholderTextColor={Colors.placeholder}
              secureTextEntry
              value={passwordForm.currentPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
              editable={!changePasswordMutation.isPending}
            />

            <TextInput
              style={styles.input}
              placeholder="Nova Senha"
              placeholderTextColor={Colors.placeholder}
              secureTextEntry
              value={passwordForm.newPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
              editable={!changePasswordMutation.isPending}
            />

            <TouchableOpacity
              style={[styles.modalButton, changePasswordMutation.isPending && styles.buttonDisabled]}
              onPress={handleChangePassword}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Alterar Senha</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setChangePasswordVisible(false)}
              disabled={changePasswordMutation.isPending}
            >
              <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={changeEmailVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setChangeEmailVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Email</Text>
              <TouchableOpacity onPress={() => setChangeEmailVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Novo Email"
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailForm.newEmail}
              onChangeText={(text) => setEmailForm({ newEmail: text })}
              editable={!changeEmailMutation.isPending}
            />

            <TouchableOpacity
              style={[styles.modalButton, changeEmailMutation.isPending && styles.buttonDisabled]}
              onPress={handleChangeEmail}
              disabled={changeEmailMutation.isPending}
            >
              {changeEmailMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Alterar Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setChangeEmailVisible(false)}
              disabled={changeEmailMutation.isPending}
            >
              <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.logout,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.text_muted,
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    color: Colors.text,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: Colors.button,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonSecondary: {
    backgroundColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
