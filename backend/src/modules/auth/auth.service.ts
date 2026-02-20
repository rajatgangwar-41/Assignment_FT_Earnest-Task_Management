import { prisma } from "../../config/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

interface RegisterInput {
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RefreshPayload extends JwtPayload {
  sub: string;
}

export const register = async ({ email, password }: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email already registered");
  }

  const hash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, passwordHash: hash },
  });

  return {
    id: user.id,
    email: user.email,
  };
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const ok = await comparePassword(password, user.passwordHash);

  if (!ok) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

export const refresh = async (refreshToken: string) => {
  let payload: RefreshPayload;

  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as RefreshPayload;
  } catch {
    throw new Error("Invalid refresh token");
  }

  if (!payload.sub) {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = signAccessToken(user.id);

  return { accessToken };
};

export const logout = async (refreshToken: string) => {
  await prisma.user.updateMany({
    where: { refreshToken },
    data: { refreshToken: null },
  });
};
