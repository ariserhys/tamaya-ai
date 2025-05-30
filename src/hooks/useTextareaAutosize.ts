import { useEffect, RefObject } from 'react';

/**
 * Hook to automatically resize a textarea based on its content
 * @param textareaRef Reference to the textarea element
 * @param maxHeight Maximum height in pixels (optional, default: 120)
 */
export function useTextareaAutosize(
  textareaRef: RefObject<HTMLTextAreaElement>,
  maxHeight: number = 120
): void {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    };
    
    textarea.addEventListener('input', adjustHeight);
    
    // Initial adjustment
    adjustHeight();
    
    return () => {
      textarea.removeEventListener('input', adjustHeight);
    };
  }, [textareaRef, maxHeight]);
} 