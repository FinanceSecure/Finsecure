import { useAuth } from "@/modules/auth/useAuth";
import { useMutation } from "@tanstack/react-query";
import { profileService } from "./profile.service";
import { ChangeEmailDTO, ChangePasswordDTO } from "./profile.types";

export const useChangePassword = () => {
  const { refreshSession } = useAuth();

  return useMutation({
    mutationFn: async (data: ChangePasswordDTO) => {
      await profileService.changePassword(data);
    },
    onSuccess: async () => {
      await refreshSession();
    },
  });
};

export const useChangeEmail = () => {
  const { refreshSession } = useAuth();

  return useMutation({
    mutationFn: async (data: ChangeEmailDTO) => {
      await profileService.changeEmail(data);
    },
    onSuccess: async () => {
      await refreshSession();
    },
  });
};

export const useDeleteAccount = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await profileService.deleteAccount();
    },
    onSuccess: async () => {
      await logout();
    },
  });
};
