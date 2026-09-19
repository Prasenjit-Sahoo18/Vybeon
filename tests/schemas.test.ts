import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  vibeEngineSchema,
  neonMixSchema,
} from "@/lib/validation/schemas";

describe("Validation Schemas", () => {
  it("validates login credentials", () => {
    const valid = loginSchema.safeParse({
      email: "demo@vybeon.app",
      password: "password123",
    });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({
      email: "not-an-email",
      password: "123",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates registration schema with password matching", () => {
    const match = registerSchema.safeParse({
      name: "Alex",
      username: "alex_beats",
      email: "alex@vybeon.app",
      password: "secretpassword",
      confirmPassword: "secretpassword",
    });
    expect(match.success).toBe(true);

    const mismatch = registerSchema.safeParse({
      name: "Alex",
      username: "alex_beats",
      email: "alex@vybeon.app",
      password: "secretpassword",
      confirmPassword: "differentpassword",
    });
    expect(mismatch.success).toBe(false);
  });

  it("validates Vibe Engine inputs", () => {
    const valid = vibeEngineSchema.safeParse({
      mood: "chill",
      energy: "low",
      durationMinutes: 45,
    });
    expect(valid.success).toBe(true);

    const invalid = vibeEngineSchema.safeParse({
      mood: "non-existent-mood",
      energy: "extreme",
      durationMinutes: 9999,
    });
    expect(invalid.success).toBe(false);
  });

  it("validates NeonMix prompt", () => {
    const valid = neonMixSchema.safeParse({
      prompt: "Play high energy cyber music",
    });
    expect(valid.success).toBe(true);

    const empty = neonMixSchema.safeParse({
      prompt: "",
    });
    expect(empty.success).toBe(false);
  });
});
