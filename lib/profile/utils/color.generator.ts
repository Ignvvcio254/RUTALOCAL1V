export class ColorGenerator {
  private static readonly COLORS = [
    '#FF6B6B', // Coral
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul claro
    '#96CEB4', // Verde menta
    '#FFEAA7', // Amarillo suave
    '#DFE6E9', // Gris claro
    '#A29BFE', // Púrpura suave
    '#FD79A8', // Rosa
    '#FDCB6E', // Naranja suave
    '#6C5CE7', // Púrpura
    '#00B894', // Verde
    '#00CEC9', // Cian
    '#FF7675', // Rojo suave
    '#74B9FF', // Azul
    '#A29BFE', // Lavanda
  ];

  static generateFromString(str: string): string {
    if (!str || str.trim().length === 0) {
      return this.COLORS[0];
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32-bit integer
    }

    const index = Math.abs(hash) % this.COLORS.length;
    return this.COLORS[index];
  }

  static generateFromInitials(initials: string): string {
    return this.generateFromString(initials);
  }

  static generateGradient(str: string): string {
    const color1 = this.generateFromString(str);
    const color2 = this.generateFromString(str + 'gradient');

    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  }

  static hexToRgba(hex: string, alpha: number = 1): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) return `rgba(0, 0, 0, ${alpha})`;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  static getContrastColor(hexColor: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

    if (!result) return '#FFFFFF';

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    // Fórmula de luminancia
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
