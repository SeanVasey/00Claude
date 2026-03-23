import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPTS: Record<string, string> = {
  agent:
    'You are an expert at creating AGENTS.md agent configuration documents for use with Claude Code and other AI coding assistants. Generate well-structured markdown documents with clear sections, practical examples, and production-ready content. Use ## and ### headers, code blocks with language tags, checklists where appropriate, and concise but thorough documentation.',
  skill:
    'You are an expert at creating SKILL.md skill documentation for use with Claude Code and other AI coding assistants. Generate well-structured markdown documents describing repeatable workflows, pipelines, or capabilities. Include clear steps, code examples, and quality checks.',
  template:
    'You are an expert at creating CLAUDE.md project configuration templates for use with Claude Code. Generate well-structured markdown documents with role definitions, principles, verification protocols, and required file specifications.',
  prompt:
    'You are an expert at creating structured prompts for use with AI coding assistants. Generate well-structured markdown documents with clear objectives, evaluation criteria, and example outputs.',
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    const { prompt, docType, model } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      SYSTEM_PROMPTS[docType] || SYSTEM_PROMPTS.agent;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${res.status}`, details: errorText },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!Array.isArray(data.content) || data.content.length === 0) {
      return NextResponse.json(
        { error: "Unexpected API response format", details: JSON.stringify(data) },
        { status: 502 }
      );
    }

    const content = data.content
      .map((block: { type: string; text?: string }) =>
        block.type === "text" ? block.text : ""
      )
      .join("");

    if (!content) {
      return NextResponse.json(
        { error: "API returned empty content" },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
