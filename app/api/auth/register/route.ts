import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return createApiError(parsed.error.issues[0]?.message || "Invalid registration data", 400);
    }

    const { name, username, email, password } = parsed.data;

    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (exists) {
      return createApiError("Email or username is already taken", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    return createApiSuccess(user, 201);
  } catch (error) {
    console.error("Registration error:", error);
    return createApiError("Registration failed", 500);
  }
}
