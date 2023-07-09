import { User } from "./prisma/prisma-client";

export interface SigninPayload {
	login: string;
	password: string;
}

export interface RegistrationPayload extends SigninPayload {}

export type UserWithoutLP = Omit<User, "login" | "password">;
