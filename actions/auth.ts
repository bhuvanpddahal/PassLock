"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import {
    SigninPayload,
    SigninValidator,
    SignupPayload,
    SignupValidator
} from "@/lib/validators/auth";
import { getUserByEmail } from "@/lib/queries/user";

export const signUp = async (payload: SignupPayload) => {
    try {
        const validatedFields = SignupValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { name, email, masterPassword } = validatedFields.data;
        
        const existingUser = await getUserByEmail(email);
        if (existingUser) return { error: "Email already taken" };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(masterPassword, salt);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                masterPassword: hashedPassword
            }
        });

        cookies().set("user", JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }), {
            path: "/",
            httpOnly: false,
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

        const existingUser = await getUserByEmail(email);
        if (!existingUser) return { error: "User not found" };

        const isCorrectPassword = await bcrypt.compare(
            masterPassword,
            existingUser.masterPassword
        );
        if(!isCorrectPassword) return { error: "Invalid credentials" };

        cookies().set("user", JSON.stringify({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email
        }), {
            path: "/",
            httpOnly: false,
            maxAge: 24 * 60 * 60, // 1 day
        });

        return { success: "Logged in successfully" };
    } catch (error: any) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};