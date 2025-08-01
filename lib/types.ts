export interface Prompt {
  id: string;
  name: string;
  template: string;
  variables: string;
  createdAt: string;
  updatedAt: string;
}

export interface VariableSet {
  id: string;
  name: string;
  variables: Record<string, string>;
}

export interface ExtractedVariable {
  name: string;
  defaultValue?: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  template: string;
  variables: string;
  note: string;
  createdAt: string;
}

export interface OpenAIOutput {
  id: string;
  promptId: string;
  prompt: string;
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;
  timestamp: string;
  error?: boolean;
  setName?: string;
}

export interface BatchAIOutputs {
  id: string;
  promptId: string;
  outputs: OpenAIOutput[];
}
