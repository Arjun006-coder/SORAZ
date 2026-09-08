export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("SORAZ Application Error:", error, context);
}
