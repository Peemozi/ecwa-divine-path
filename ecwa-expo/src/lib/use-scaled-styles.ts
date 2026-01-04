import { useFontSize } from './font-size-context';

/**
 * Hook to get scaled font sizes for text styles
 * Usage: const scaledStyles = useScaledStyles({ fontSize: 16 }, styles);
 */
export function useScaledStyles<T extends Record<string, any>>(
  baseStyles: Partial<T>,
  additionalStyles?: T
): T {
  const { getScaledSize } = useFontSize();
  
  const scaled: Partial<T> = {};
  
  // Scale font sizes in baseStyles
  Object.keys(baseStyles).forEach((key) => {
    const value = baseStyles[key];
    if (typeof value === 'object' && value !== null && 'fontSize' in value) {
      scaled[key as keyof T] = {
        ...value,
        fontSize: getScaledSize(value.fontSize as number),
      } as T[keyof T];
    } else {
      scaled[key as keyof T] = value;
    }
  });
  
  // Merge with additional styles
  return { ...scaled, ...additionalStyles } as T;
}
