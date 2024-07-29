"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserToUpdate = validateUserToUpdate;
function validateUserToUpdate(user) {
    const errors = [];
    if (!user.id) {
        errors.push('id is required');
    }
    if (!user.email) {
        errors.push('email is required');
    }
    if (!user.name) {
        errors.push('name is required');
    }
    return errors;
}
