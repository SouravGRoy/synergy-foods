import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a new account",
};

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90",
                        card: "shadow-lg",
                    },
                }}
                redirectUrl="/dashboard/categories"
                signInUrl="/auth/clerk-signin"
            />
        </div>
    );
}
