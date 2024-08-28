export type GetUserResponseDto = {
  name: string;
  lastName: string | undefined | null;
  id: string;
  email: string;
};

export type UpdateUserResponseDto = {
  name: string;
  email: string;
  id: string;
  lastName: string | null | undefined;
};

export type ChangePasswordDto = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};
