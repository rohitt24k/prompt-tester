import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyContent = (content: string): void => {
  navigator.clipboard.writeText(content);
  toast.success('successfully copied');
};
