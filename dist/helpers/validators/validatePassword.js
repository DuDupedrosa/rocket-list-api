"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = validatePassword;
const Password_1 = require("../enums/Password");
const erroPasswordData = {
    HAS_UPPER_CASE: {
        enum: Password_1.passwordErroValidateEnum.HAS_UPPER_CASE,
        key: 'required_one_uppercase.',
    },
    HAS_LOWER_CASE: {
        enum: Password_1.passwordErroValidateEnum.HAS_LOWER_CASE,
        key: 'required_one_lowercase',
    },
    HAS_DIGITS: {
        enum: Password_1.passwordErroValidateEnum.HAS_DIGITS,
        key: 'required_one_digit',
    },
    HAS_SPECIAL_CHARACTER: {
        enum: Password_1.passwordErroValidateEnum.HAS_SPECIAL_CHARACTER,
        key: 'required_one_special_character',
    },
    HAS_MIN_DIFFERENT_CHAR: {
        enum: Password_1.passwordErroValidateEnum.HAS_MIN_DIFFERENT_CHAR,
        key: 'required_min_six_different_characters',
    },
    HAS_MIN_LENGTH: {
        enum: Password_1.passwordErroValidateEnum.HAS_MIN_LENGTH,
        key: 'required_min_eight_characters',
    },
};
function hasUpperCase(password) {
    return /[A-Z]/.test(password);
}
function hasLowerCase(password) {
    return /[a-z]/.test(password);
}
function hasDigits(password) {
    return /[\d]/.test(password);
}
function hasSpecialChar(password) {
    return /[@$!%*?&_-]/.test(password);
}
function hasMinDifferentChar(password, min) {
    const uniqueChar = new Set(password).size;
    return uniqueChar >= min;
}
function hasMinLength(password, min) {
    return password.length >= min;
}
function validatePassword(password) {
    if (!hasUpperCase(password))
        return erroPasswordData.HAS_UPPER_CASE;
    if (!hasLowerCase(password))
        return erroPasswordData.HAS_LOWER_CASE;
    if (!hasDigits(password))
        return erroPasswordData.HAS_DIGITS;
    if (!hasSpecialChar(password))
        return erroPasswordData.HAS_SPECIAL_CHARACTER;
    if (!hasMinDifferentChar(password, 6))
        return erroPasswordData.HAS_MIN_DIFFERENT_CHAR;
    if (!hasMinLength(password, 8))
        return erroPasswordData.HAS_MIN_LENGTH;
    return true;
}
