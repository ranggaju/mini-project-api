import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { createCustomError } from "../utils/customError";
import { SECRET_KEY } from "../config/env.config";

export interface RegisterTokenPayload {
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    registerUser?: RegisterTokenPayload;
  }
}

export function registerTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    console.log("🟡 [registerTokenMiddleware] Incoming verify request...");
    console.log("🔹 Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createCustomError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Extracted Token:", token);
    const decoded = verify(token, SECRET_KEY) as RegisterTokenPayload;
    console.log("🧩 Decoded Payload:", decoded);


    if (!decoded?.email) {
        console.log("❌ Invalid or expired token payload");
        throw createCustomError(403, "Invalid or expired token");
    }

    req.registerUser = decoded;

    next();
  } catch (err) {
    console.error("🚨 registerTokenMiddleware ERROR:", err);
    next(err);
  }
}
