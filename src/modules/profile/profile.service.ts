import { authService } from "@/modules/auth/auth.service";
import { ChangeEmailDTO, ChangePasswordDTO } from "./profile.types";

export const profileService = {
  changePassword: async (data: ChangePasswordDTO): Promise<void> => {
    await authService.changePassword(data.currentPassword, data.newPassword);
  },

  changeEmail: async (data: ChangeEmailDTO): Promise<void> => {
    await authService.changeEmail(data.newEmail);
  },

  deleteAccount: async (): Promise<void> => {
    await authService.deleteAccount();
  },
};
