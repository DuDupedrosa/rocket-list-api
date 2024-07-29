export type UserRegisterDto = {
  name: string;
  lastName: string | null;
  id: string | null;
  password: string;
  email: string;
};

export type UserRegisterResponseDto = {
  user: {
    name: string;
    email: string;
    id: string;
  };
  token: string;
};

export type UserSignInResponseDto = {
  user: {
    name: string;
    lastName: string | null | undefined;
    id: string;
    email: string;
  };
  token: string;
};
