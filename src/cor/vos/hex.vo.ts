import { ObjectUtils } from '@/infrastructure/utils';
import { ToString } from '@/infrastructure/decorators/to-string.decorator';

@ToString()
export class HexVO {
  constructor(private readonly hex: string) {}

  static of(hex: string) {
    ObjectUtils.requireTrue(
      HexVO.isValidHex(hex),
      `"${hex}" não é um valor de cor HEX válido.`,
    );
    return new HexVO(hex);
  }

  private static isValidHex(hex: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
  }

  public getHex(): string {
    return this.hex;
  }

  private getRGB(): [number, number, number] {
    const r = parseInt(this.hex.slice(1, 3), 16);
    const g = parseInt(this.hex.slice(3, 5), 16);
    const b = parseInt(this.hex.slice(5, 7), 16);
    return [r, g, b];
  }

  public getRGBString(): string {
    return this.getRGB().join(', ');
  }

  public getHSLString(): string {
    return this.getHSL().join(', ');
  }

  private getHSL(): [number, number, number] {
    const [r, g, b] = this.getRGB();
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }
}
