/**
 * Settings validation (Angular settings.component form validators).
 *
 * Fix (D2): Angular's "Save changes" showed "Saved" whatever the forms
 * held — an empty name, a malformed email, a 3-character password, or a
 * confirmation that did not match. Each section now validates before it
 * saves.
 */

import type { AppSettings } from '../models';
import type { FieldErrors } from './directory';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s().-]{6,}$/;

export function validateProfile(
  profile: AppSettings['profile']
): FieldErrors<keyof AppSettings['profile']> {
  const errors: FieldErrors<keyof AppSettings['profile']> = {};
  if (!profile.firstName.trim()) errors.firstName = 'Enter your first name.';
  if (!profile.lastName.trim()) errors.lastName = 'Enter your last name.';
  if (!profile.email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL.test(profile.email.trim())) errors.email = 'Enter a valid email address.';
  if (profile.phone.trim() && !PHONE.test(profile.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }
  return errors;
}

export function validateOrganization(
  organization: AppSettings['organization']
): FieldErrors<keyof AppSettings['organization']> {
  return organization.labName.trim() ? {} : { labName: 'Enter the laboratory name.' };
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const EMPTY_PASSWORD_CHANGE: PasswordChange = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

/** Angular: min length 8 on the new password only. */
export function validatePasswordChange(change: PasswordChange): FieldErrors<keyof PasswordChange> {
  const errors: FieldErrors<keyof PasswordChange> = {};
  if (!change.currentPassword) errors.currentPassword = 'Enter your current password.';
  if (change.newPassword.length < 8) errors.newPassword = 'Use at least 8 characters.';
  else if (change.newPassword === change.currentPassword) {
    errors.newPassword = 'Choose a password different from the current one.';
  }
  if (change.confirmPassword !== change.newPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;
