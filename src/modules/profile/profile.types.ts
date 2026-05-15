export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailDTO {
  newEmail: string;
}

export interface UserProfile {
  name: string;
  email: string;
  userId: string;
}
