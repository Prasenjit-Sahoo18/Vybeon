import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { findUserByEmailOrUsername, createUser } from "@/lib/auth/user-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return createApiError(parsed.error.issues[0]?.message || "Invalid registration data", 400);
    }

    const { name, username, email, password } = parsed.data;

    const exists = await findUserByEmailOrUsername(email, username);
    if (exists) {
      return createApiError("Email or username is already taken", 409);
    }

    const user = await createUser({
      name,
      username,
      email,
      password,
    });

    return createApiSuccess({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    }, 201);
  } catch (error) {
    console.error("Registration error:", error);
    return createApiError("Registration failed", 500);
  }
}
