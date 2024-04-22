"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import {
    GetUserEmailPayload,
    GetUserEmailValidator,
    ResendTokenPayload,
    ResendTokenValidator,
    SigninPayload,
    SigninValidator,
    SignupPayload,
    SignupValidator,
    VerifyEmailPayload,
    VerifyEmailValidator
} from "@/lib/validators/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { getUserByEmail, getUserById } from "@/lib/queries/user";
import { getVerificationTokenByEmail } from "@/lib/queries/verification-token";

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

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(email, verificationToken.token);

        return { userId: newUser.id, success: "Verification email sent" };
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

        const user = await getUserByEmail(email);
        if (!user) return { error: "User not found" };

        const isCorrectPassword = await bcrypt.compare(
            masterPassword,
            user.masterPassword
        );
        if (!isCorrectPassword) return { error: "Invalid credentials" };

        if (user.emailVerified) {
            cookies().set("user", JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email
            }), {
                path: "/",
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 3, // 3 days
            });

            return { success: "Logged in successfully" };
        } else {
            const verificationToken = await generateVerificationToken(email);
            await sendVerificationEmail(email, verificationToken.token);

            return { userId: user.id, success: "Verification email sent" };
        }
    } catch (error: any) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
    try {
        const validatedFields = VerifyEmailValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { userId, token } = validatedFields.data;

        const user = await getUserById(userId);
        if (!user) return { error: "User not found" };
        if (user.emailVerified) {
            return { success: "Email is already verified" };
        }

        const verificationToken = await getVerificationTokenByEmail(user.email);
        if (!verificationToken) return { error: "Token not found" };

        if (token !== verificationToken.token) {
            return { error: "Token is not matching" };
        }

        const hasExpired = new Date(verificationToken.expires) < new Date();
        if (hasExpired) return { error: "Token has expired" };

        await db.verificationToken.delete({
            where: { id: verificationToken.id }
        });

        await db.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date()
            }
        });

        cookies().set("user", JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }), {
            path: "/",
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 3, // 3 days
        });

        return { success: "Email verified successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const resendToken = async (payload: ResendTokenPayload) => {
    try {
        const validatedFields = ResendTokenValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { userId } = validatedFields.data;

        const user = await getUserById(userId);
        if (!user) return { error: "User not found" };
        if (user.emailVerified) {
            return { error: "Cannot send token to already verified email" };
        }

        const newVerificationToken = await generateVerificationToken(user.email);
        await sendVerificationEmail(user.email, newVerificationToken.token);

        return { success: "Token resended successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getUserEmail = async (payload: GetUserEmailPayload) => {
    try {
        const validatedFields = GetUserEmailValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { userId } = validatedFields.data;

        const user = await getUserById(userId);
        if (!user) return { error: "User not found" };

        return { email: user.email };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};