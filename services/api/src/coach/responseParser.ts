export function cleanAndParseJson(rawText: string): unknown {
  let cleaned = rawText.trim();

  // Remove markdown code block fences if present
  if (cleaned.startsWith('```')) {
    // Remove starting fence
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    // Remove ending fence
    cleaned = cleaned.replace(/\s*```$/, '');
  }

  cleaned = cleaned.trim();

  return JSON.parse(cleaned);
}
