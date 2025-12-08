import { ProfileData, ValidationResult } from '../types/profile.types';
import { Avatar } from './avatar';
import { ValidationEngine } from '../utils/validation.engine';

export class UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar: Avatar;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };

  constructor(data: ProfileData & { avatar?: Avatar }) {
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.bio = data.bio;
    this.location = data.location;
    this.avatar = data.avatar ?? Avatar.fromUser({ name: data.name });
  }

  static create(data: ProfileData): UserProfile {
    return new UserProfile(data);
  }

  validate(): ValidationResult {
    const validator = new ValidationEngine();

    validator.addRule('name', {
      type: 'required',
      message: 'El nombre es requerido',
    });

    validator.addRule('name', {
      type: 'minLength',
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres',
    });

    validator.addRule('email', {
      type: 'required',
      message: 'El email es requerido',
    });

    validator.addRule('email', {
      type: 'email',
      message: 'Email inválido',
    });

    if (this.phone) {
      validator.addRule('phone', {
        type: 'phone',
        message: 'Teléfono inválido',
      });
    }

    if (this.bio) {
      validator.addRule('bio', {
        type: 'maxLength',
        value: 500,
        message: 'La biografía no puede exceder 500 caracteres',
      });
    }

    return validator.validate({
      name: this.name,
      email: this.email,
      phone: this.phone,
      bio: this.bio,
    });
  }

  update(data: Partial<ProfileData>): void {
    if (data.name !== undefined) {
      this.name = data.name;
      // Actualizar avatar con nuevas iniciales si cambia el nombre
      this.avatar = Avatar.fromUser({
        name: this.name,
        avatar: this.avatar.url,
      });
    }

    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.bio !== undefined) this.bio = data.bio;
    if (data.location !== undefined) this.location = data.location;
  }

  toJSON(): ProfileData {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      bio: this.bio,
      location: this.location,
    };
  }
}
