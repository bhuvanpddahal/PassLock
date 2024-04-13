"use server";

import Cryptr from "cryptr";
import { db } from "@/lib/db";
import {
    SigninPayload,
    SigninValidator,
    SignupPayload,
    SignupValidator
} from "@/lib/validators/auth";
import { cookies } from "next/headers";
import { getUserByEmail } from "@/lib/queries/user";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY!);

export const signUp = async (payload: SignupPayload) => {
    try {
        const validatedFields = SignupValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { name, email, masterPassword } = validatedFields.data;
        const encryptedPassword = cryptr.encrypt(masterPassword);

        const existingUser = await getUserByEmail(email);
        if (existingUser) return { error: "Email already taken" };

        const newUser = await db.user.create({
            data: {
                name,
                email,
                masterPassword: encryptedPassword
            }
        });

        cookies().set("user", JSON.stringify(newUser), {
            path: "/",
            httpOnly: true,
            maxAge: 24 * 60 * 60 // 1 day
        });

        return { success: "Signed up successfully" };
    } catch (error: any) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const signIn = async (payload: SigninPayload) => {
    try {
        const validatedFields = SigninValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { email, masterPassword } = validatedFields.data;
        const encryptedPassword = cryptr.encrypt(masterPassword);

        const existingUser = await getUserByEmail(email);
        if (!existingUser) return { error: "User not found" };

        cookies().set("user", JSON.stringify(existingUser), {
            path: "/",
            httpOnly: true,
            maxAge: 24 * 60 * 60 // 1 day
        });

        return { success: "Logged in successfully" };
    } catch (error: any) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};