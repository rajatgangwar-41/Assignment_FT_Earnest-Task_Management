import type { Request, Response } from "express";
import * as service from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

export const register = async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);

  const data = await service.register(input);
  res.status(201).json(data);
};

export const login = async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);

  const { accessToken, refreshToken } = await service.login(input);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production with https
    path: "/",
  });

  res.json({ accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  const data = await service.refresh(refreshToken);

  res.json(data);
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (refreshToken) {
    await service.logout(refreshToken);
  }

  res.clearCookie("refreshToken", { path: "/" });

  res.status(204).send();
};
