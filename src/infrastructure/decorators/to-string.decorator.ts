interface MaskConfig {
  [key: string]: (value: any) => string;
}

export function ToString(maskConfig?: MaskConfig) {
  return function (target: any) {
    target.prototype.toString = function (): string {
      const result: string[] = [];
      for (const prop in this) {
        if (this.hasOwnProperty(prop)) {
          if (maskConfig?.hasOwnProperty(prop)) {
            const maskedValue = maskConfig[prop](this[prop]);
            result.push(`"${prop}": "${maskedValue}"`);
          } else {
            result.push(`"${prop}": "${this[prop]}"`);
          }
        }
      }
      return `${target.name}({ ${result.join(', ')} })`;
    };
  };
}
