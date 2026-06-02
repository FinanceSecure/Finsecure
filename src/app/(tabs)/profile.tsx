import { AlertMessage } from "@/components/Profile/AlertMessage";
import { BrandMark } from "@/components/BrandMark";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { SettingGroup } from "@/components/Profile/SettingGroup";
import { SettingItem } from "@/components/Profile/SettingItem";
import { useAuth } from "@/modules/auth/useAuth";
import { getUiErrorMessage } from "@/api/apiError";
import { useChangeEmail, useChangePassword, useDeleteAccount } from "@/modules/profile/useProfile";
import { Colors } from "@constants/theme";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [changeEmailVisible, setChangeEmailVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [emailForm, setEmailForm] = useState({ newEmail: "" });
  const changePasswordMutation = useChangePassword();
  const changeEmailMutation = useChangeEmail();
  const deleteAccountMutation = useDeleteAccount();

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setAlert({ type: "error", message: "Preencha todos os campos" });
      return;
    }

    if (
      passwordForm.newPassword.length < 12
      || !/[A-Z]/.test(passwordForm.newPassword)
      || !/[^A-Za-z0-9]/.test(passwordForm.newPassword)
    ) {
      setAlert({ type: "error", message: "Use pelo menos 12 caracteres, uma letra maiúscula e um caractere especial." });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync(passwordForm);
      setAlert({ type: "success", message: "Senha alterada com sucesso!" });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setChangePasswordVisible(false);
    } catch (error: unknown) {
      setAlert({ type: "error", message: getUiErrorMessage(error, "Erro ao alterar senha.") });
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
    } catch (error: unknown) {
      setAlert({ type: "error", message: getUiErrorMessage(error, "Erro ao alterar email.") });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Deletar Conta",
      "Tem certeza? Esta ação é irreversível e todos os seus dados serão permanentemente removidos.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await deleteAccountMutation.mutateAsync();
              setAlert({ type: "success", message: "Conta deletada com sucesso!" });
            } catch (error: unknown) {
              setAlert({ type: "error", message: getUiErrorMessage(error, "Erro ao deletar conta.") });
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
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

        <View style={styles.brandHeader}>
          <BrandMark compact />
          <Text style={styles.eyebrow}>PERFIL PATRIMONIAL</Text>
        </View>

        <ProfileHeader name={user?.name || "Usuário"} subtitle="Membro Midnight Capital" />

        <View style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>PATRIMÔNIO TOTAL ESTIMADO</Text>
          <Text style={styles.netWorthValue}>R$ 0,00</Text>
          <Text style={styles.netWorthTrend}>Dados consolidados no dashboard</Text>
        </View>

        <View style={styles.healthGrid}>
          <HealthCard icon="water-outline" label="Liquidez" value="Em análise" />
          <HealthCard icon="pie-chart-outline" label="Alocação" value="Carteira ativa" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Objetivos financeiros</Text>
          <Text style={styles.sectionLink}>Ver todos</Text>
        </View>
        <GoalCard label="Reserva estratégica" progress={38} />
        <GoalCard label="Independência financeira" progress={12} />

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
            onPress={() => router.push("/legal/privacy" as Href)}
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
          <FontAwesome6 name="arrow-right-from-bracket" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Midnight Capital v1.0.0</Text>
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
                <ActivityIndicator color={Colors.background} />
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
                <ActivityIndicator color={Colors.background} />
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

function HealthCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.healthCard}>
      <Ionicons name={icon} size={18} color={Colors.primary} />
      <Text style={styles.healthLabel}>{label}</Text>
      <Text style={styles.healthValue}>{value}</Text>
    </View>
  );
}

function GoalCard({ label, progress }: { label: string; progress: number }) {
  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={styles.goalValue}>{progress}%</Text>
      </View>
      <View style={styles.goalTrack}>
        <View style={[styles.goalFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.goalCaption}>Estrutura preparada para metas personalizadas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 42,
    paddingBottom: 80,
  },
  brandHeader: {
    marginBottom: 4,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 18,
  },
  netWorthCard: {
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginBottom: 12,
  },
  netWorthLabel: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  netWorthValue: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 8,
  },
  netWorthTrend: {
    color: Colors.receita,
    fontSize: 11,
    marginTop: 8,
  },
  healthGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  healthCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  healthLabel: {
    color: Colors.text_muted,
    fontSize: 11,
    marginTop: 10,
  },
  healthValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionLink: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  goalCard: {
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  goalValue: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  goalTrack: {
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: Colors.surfaceSoft,
    marginTop: 12,
  },
  goalFill: {
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  goalCaption: {
    color: Colors.text_muted,
    fontSize: 10,
    marginTop: 9,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.logout,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.text_muted,
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    color: Colors.text,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  modalButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonSecondary: {
    backgroundColor: Colors.border,
    borderRadius: 12,
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
