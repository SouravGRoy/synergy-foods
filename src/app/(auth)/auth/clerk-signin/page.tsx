import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account",
};

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignIn
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90",
                        card: "shadow-lg",
                    },
                }}
                redirectUrl="/dashboard/categories"
                signUpUrl="/auth/clerk-signup"
            />
        </div>
    );
}
