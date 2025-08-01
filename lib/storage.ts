import { Prompt, PromptVersion, VariableSet } from './types';

const PROMPTS_KEY = 'prompt_playground_prompts';
const VERSIONS_KEY = 'prompt_playground_versions';
const VARIABLE_SETS_KEY = 'prompt_playground_variable_sets';

export function loadPrompts(): Prompt[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(PROMPTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load prompts:', error);
    return [];
  }
}

export function savePrompts(prompts: Prompt[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error('Failed to save prompts:', error);
  }
}

export function loadVersions(): PromptVersion[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(VERSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load versions:', error);
    return [];
  }
}

export function saveVersions(versions: PromptVersion[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
  } catch (error) {
    console.error('Failed to save versions:', error);
  }
}

export function loadVariableSets(): Record<string, VariableSet[]> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(VARIABLE_SETS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load variable sets:', error);
    return {};
  }
}

export function saveVariableSets(
  variableSets: Record<string, VariableSet[]>,
): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VARIABLE_SETS_KEY, JSON.stringify(variableSets));
  } catch (error) {
    console.error('Failed to save variable sets:', error);
  }
}
