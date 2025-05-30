import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Styles occurrences of "Tamaya" with the tamaya-text styling
 * For use with React's dangerouslySetInnerHTML
 */
export function styleTamayaText(text: string): { __html: string } {
  const styledText = text.replace(
    /\b(Tamaya['']?s?)\b/g, 
    '<span class="tamaya-text">$1</span>'
  );
  return { __html: styledText };
}
