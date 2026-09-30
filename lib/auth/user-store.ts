import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export interface StoredUser {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  password?: string | null;
  image?: string | null;
}

// In-memory user store for development / offline / demo mode
// Pre-seeded with the demo account: demo@vybeon.app / demo1234
const fallbackUsers: Record<string, StoredUser> = {
  "demo@vybeon.app": {
    id: "usr-demo-001",
    name: "Demo Listener",
    username: "demo_listener",
    email: "demo@vybeon.app",
    password: bcrypt.hashSync("demo1234", 10),
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser",
  },
};

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  // 1. Try Prisma first if available
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        password: true,
      },
    });
    if (dbUser) return dbUser;
  } catch {
    // Database connection failed, fall through to fallback store
  }

  // 2. Check fallback store
  return fallbackUsers[email.toLowerCase()] || null;
}

export async function findUserByEmailOrUsername(email: string, username: string): Promise<StoredUser | null> {
  try {
    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (dbUser) return dbUser;
  } catch {
    // Database unavailable
  }

  // Check fallback store
  const allUsers = Object.values(fallbackUsers);
  for (const user of allUsers) {
    if (
      user.email?.toLowerCase() === email.toLowerCase() ||
      user.username?.toLowerCase() === username.toLowerCase()
    ) {
      return user;
    }
  }

  return null;
}

export async function createUser(data: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<StoredUser> {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 1. Try Prisma first
  try {
    const dbUser = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });
    return dbUser;
  } catch {
    // Database unavailable, save to fallback store
  }

  const newUser: StoredUser = {
    id: `usr-${Date.now()}`,
    name: data.name,
    username: data.username,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.username)}`,
  };

  fallbackUsers[newUser.email!] = newUser;
  return newUser;
}
