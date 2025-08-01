import nunjucks from 'nunjucks';

// Extract variable names from a Jinja2/Nunjucks template
export function extractVariables(template: string): string[] {
  const variablePattern = /\{\{\s*([^}]+)\s*\}\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = variablePattern.exec(template)) !== null) {
    // Extract the variable name, handling simple cases
    const varExpression = match[1].trim();
    // Handle simple variable names (not complex expressions)
    const simpleVarMatch = varExpression.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (simpleVarMatch) {
      variables.add(simpleVarMatch[1]);
    }
  }

  return Array.from(variables).sort();
}

// Render template with variables
export function renderTemplate(
  template: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>,
): string {
  try {
    const env = new nunjucks.Environment();

    const parsedVariables = Object.fromEntries(
      Object.entries(variables).map(([key, value]) => {
        try {
          return [key, typeof value === 'string' ? JSON.parse(value) : value];
        } catch {
          return [key, value]; // fallback if not valid JSON
        }
      }),
    );

    return env.renderString(template, parsedVariables);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Template rendering failed',
    );
  }
}
