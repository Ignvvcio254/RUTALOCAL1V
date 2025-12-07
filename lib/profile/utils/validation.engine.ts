import { ValidationResult, ValidationRule } from '../types/api.types';

export class ValidationEngine {
  private rules: Map<string, ValidationRule[]>;

  constructor() {
    this.rules = new Map();
  }

  addRule(field: string, rule: ValidationRule): void {
    const existingRules = this.rules.get(field) || [];
    existingRules.push(rule);
    this.rules.set(field, existingRules);
  }

  addRules(field: string, rules: ValidationRule[]): void {
    rules.forEach(rule => this.addRule(field, rule));
  }

  validate(data: Record<string, any>): ValidationResult {
    const errors: Record<string, string> = {};

    this.rules.forEach((fieldRules, field) => {
      const value = data[field];

      for (const rule of fieldRules) {
        const error = this.validateRule(value, rule);
        if (error) {
          errors[field] = error;
          break; // Solo mostrar el primer error por campo
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  private validateRule(value: any, rule: ValidationRule): string | null {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(value) ? null : rule.message;

      case 'email':
        return this.validateEmail(value) ? null : rule.message;

      case 'phone':
        return this.validatePhone(value) ? null : rule.message;

      case 'minLength':
        return this.validateMinLength(value, rule.value) ? null : rule.message;

      case 'maxLength':
        return this.validateMaxLength(value, rule.value) ? null : rule.message;

      case 'pattern':
        return this.validatePattern(value, rule.value) ? null : rule.message;

      case 'custom':
        return rule.validator && rule.validator(value) ? null : rule.message;

      default:
        return null;
    }
  }

  private validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  }

  private validateEmail(value: string): boolean {
    if (!value) return true; // Optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private validatePhone(value: string): boolean {
    if (!value) return true; // Optional
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  }

  private validateMinLength(value: string, minLength: number): boolean {
    if (!value) return true; // Optional
    return value.length >= minLength;
  }

  private validateMaxLength(value: string, maxLength: number): boolean {
    if (!value) return true; // Optional
    return value.length <= maxLength;
  }

  private validatePattern(value: string, pattern: RegExp): boolean {
    if (!value) return true; // Optional
    return pattern.test(value);
  }

  // Métodos estáticos para validaciones comunes
  static email(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  static phone(value: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  }

  static imageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  static url(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  static passwordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Al menos 8 caracteres');

    if (password.length >= 12) score++;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else feedback.push('Mayúsculas y minúsculas');

    if (/\d/.test(password)) score++;
    else feedback.push('Al menos un número');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('Al menos un carácter especial');

    return { score, feedback };
  }
}
