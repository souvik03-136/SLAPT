import type { ParseResult } from '../../types/slapt';

export async function parseCode(code: string): Promise<ParseResult> {
  const res = await fetch('/api/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    throw new Error(`Parser service error: ${res.status}`);
  }

  return res.json() as Promise<ParseResult>;
}