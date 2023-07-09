import { RegistrationPayload, SigninPayload } from "./types";

export function isSigninPayload(x: any): x is SigninPayload {
	return "login" in x && "password" in x;
}

export function isRegistrationPayload(x: any): x is RegistrationPayload {
	return "login" in x && "password" in x;
}

export function errorToString(error: any): string {
	return typeof error === "string"
		? error
		: "message" in error
		? error.message
		: "Неизвестная ошибка";
}
