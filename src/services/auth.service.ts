import { StatusCodes } from "http-status-codes";
import HTTPException from "../exceptions/http.exception";
import { isEmpty } from "../utils/isEmpty.util";
import { prisma } from "../prisma/prisma";
import { comparePassword, hashPassword } from "../utils/hash.util";
import {
  loginDataType,
  signUpDataType,
  TokenDataType,
} from "../interfaces/auth.interface";
import { generateToken } from "../utils/jwt.util";

export class AuthService {
  
  public signup = async (userData: signUpDataType) => {
    if (isEmpty(userData)) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, "Empty user data");
    }

    const { fullName, email, phone, password, role, passwordRepeat } = userData;
    const allowedRoles = ["renter", "landlord"];
    if (!role || !allowedRoles.includes(role.toLowerCase())) {
      throw new HTTPException(
        StatusCodes.BAD_REQUEST,
        "Invalid or missing role. Role must be renter or landlord"
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, "Email already registered");
    }

    if (password !== passwordRepeat) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, "Passwords don't match");
    }

    let userRole = await prisma.role.findUnique({
      where: { name: role.toLowerCase() },
    });

    if (!userRole) {
      userRole = await prisma.role.create({
        data: { name: role.toLowerCase() },
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: {
          connect: { id: userRole.id },
        },
      },
    });

    return newUser;
  };

  public login = async (
    loginData: loginDataType
  ): Promise<{ user: any; token: TokenDataType; cookie: string }> => {
    if (isEmpty(loginData)) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, "Empty login data");
    }

    const { emailOrPhone, password } = loginData;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
      include: { role: true },
    });

    if (!user) {
      throw new HTTPException(StatusCodes.NOT_FOUND, "User not found");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new HTTPException(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    const cookie = this.createCookie(token);
    return { user, cookie, token };
  };

  public logout = async (userId: string) => {
    if (isEmpty(userId)) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, "Empty user Id");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HTTPException(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  };

  private createCookie(tokenData: TokenDataType): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}