const erroPasswordData = {
  HAS_UPPER_CASE: {
    enum: 1,
    key: 'required_one_uppercase.',
  },
  HAS_LOWER_CASE: {
    enum: 2,
    key: 'required_one_lowercase',
  },
  HAS_DIGITS: {
    enum: 3,
    key: 'required_one_digit',
  },
  HAS_SPECIAL_CHARACTER: {
    enum: 4,
    key: 'required_one_special_character',
  },
  HAS_MIN_DIFFERENT_CHAR: {
    enum: 5,
    key: 'required_min_six_different_characters',
  },
  HAS_MIN_LENGTH: {
    enum: 6,
    key: 'required_min_eight_characters',
  },
};

function hasUpperCase(password: string): boolean {
  return /[A-Z]/.test(password);
}

function hasLowerCase(password: string): boolean {
  return /[a-z]/.test(password);
}

function hasDigits(password: string): boolean {
  return /[\d]/.test(password);
}

function hasSpecialChar(password: string): boolean {
  return /[@$!%*?&_-]/.test(password);
}

function hasMinDifferentChar(password: string, min: number): boolean {
  const uniqueChar = new Set(password).size;

  return uniqueChar >= min;
}

function hasMinLength(password: string, min: number): boolean {
  return password.length >= min;
}

export function validatePassword(password: string): boolean | object {
  if (!hasUpperCase(password)) return erroPasswordData.HAS_UPPER_CASE;
  if (!hasLowerCase(password)) return erroPasswordData.HAS_LOWER_CASE;
  if (!hasDigits(password)) return erroPasswordData.HAS_DIGITS;
  if (!hasSpecialChar(password)) return erroPasswordData.HAS_SPECIAL_CHARACTER;
  if (!hasMinDifferentChar(password, 6))
    return erroPasswordData.HAS_MIN_DIFFERENT_CHAR;
  if (!hasMinLength(password, 8)) return erroPasswordData.HAS_MIN_LENGTH;

  return true;
}
