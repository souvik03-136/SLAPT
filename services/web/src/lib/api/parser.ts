import type { ParseResult } from "../../types/slapt";

const PARSER_URL =
  typeof window !== "undefined"
    ? "/api/parse"
    : `${process.env.PARSER_URL ?? "http://parser:3001"}/api/parse`;

export async function parseCode(code: string): Promise<ParseResult> {
  const res = await fetch(PARSER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    throw new Error(`Parser service error: ${res.status}`);
  }

  return res.json() as Promise<ParseResult>;
}