import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
	RegistrationPayload,
	SigninPayload,
	UserWithoutLP,
} from "../../../types";

export const useSession = create<{
	isLoading: boolean;
	isError: boolean;
	error: any | null;
	user: UserWithoutLP | null;

	signin: (data: SigninPayload) => Promise<any>;
	signout: () => Promise<any>;
	registration: (data: RegistrationPayload) => Promise<any>;
	checkSession: () => Promise<any>;
}>()(
	immer((set, get) => {
		const signin = async (data: SigninPayload) => {
			try {
				set((state) => {
					state.isLoading = true;
					state.isError = false;
					state.error = null;
				});

				const response = await fetch("/signin", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ data }),
				});

				if (response.ok) {
					const data = (await response.json()) as {
						user: UserWithoutLP;
					};

					set((state) => {
						state.user = data.user;
					});
				} else {
					let text = "";

					try {
						text = await response.text();
					} catch (error: any) {}

					throw Error(text || "Неизвестная ошибка");
				}
			} catch (error: any) {
			} finally {
				set((state) => {
					state.isLoading = false;
				});
			}
		};

		const signout = async () => {
			try {
				set((state) => {
					state.isLoading = true;
				});

				fetch("/signout");
			} catch (error: any) {
				set((state) => {
					state.isError = true;
					state.error = error;
				});
			} finally {
				set((state) => {
					state.isLoading = false;
				});
			}
		};

		const registration = async (data: RegistrationPayload) => {
			try {
				set((state) => {
					state.isLoading = true;
					state.isError = false;
					state.error = null;
				});

				const response = await fetch("/registration", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ data }),
				});

				if (response.ok) {
					return true;
				} else {
					let text = "";

					try {
						text = await response.text();
					} catch (error: any) {}

					throw Error(text || "Неизвестная ошибка");
				}
			} catch (error: any) {
				set((state) => {
					state.isError = true;
					state.error = error;
				});

				// throw error;
			} finally {
				set((state) => {
					state.isLoading = false;
				});
			}
		};

		const checkSession = async () => {
			try {
				set((state) => {
					state.isLoading = true;
				});

				const response = await fetch("/session");

				if (response.ok) {
					const user = (await response.json()) as UserWithoutLP;
					set((state) => (state.user = user));
				}

				set((state) => {
					state.isLoading = false;
				});
			} catch (error: any) {}
		};

		return {
			isLoading: false,
			isError: false,
			error: null,
			user: null,

			signin,
			signout,
			registration,
			checkSession,
		};
	})
);
