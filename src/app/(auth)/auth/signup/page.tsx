import { SignUpForm } from "@/components/globals/forms";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Create an Account",
    description: "Create an account to access all features",
};

export default function Page() {
    return (
        <div className="flex min-h-screen">
            {/* Left Side - Branding */}
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 lg:flex lg:w-1/2">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 backdrop-blur-sm transition-colors group-hover:bg-background/20">
                            <span className="text-2xl font-bold">🍃</span>
                        </div>
                        <span className="text-2xl font-bold">
                            {siteConfig.name}
                        </span>
                    </Link>

                    <div className="max-w-md space-y-6">
                        <h1 className="text-4xl leading-tight font-bold">
                            Start your shopping journey today
                        </h1>
                        <p className="text-lg text-primary-foreground/80">
                            Join thousands of satisfied customers and discover
                            amazing deals on quality products.
                        </p>

                        <div className="space-y-4 pt-8">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm">
                                    <span className="text-lg">✓</span>
                                </div>
                                <div>
                                    <div className="font-semibold">
                                        Free Shipping
                                    </div>
                                    <div className="text-sm text-primary-foreground/70">
                                        On orders over $50
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm">
                                    <span className="text-lg">✓</span>
                                </div>
                                <div>
                                    <div className="font-semibold">
                                        Secure Checkout
                                    </div>
                                    <div className="text-sm text-primary-foreground/70">
                                        Your data is safe with us
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm">
                                    <span className="text-lg">✓</span>
                                </div>
                                <div>
                                    <div className="font-semibold">
                                        Easy Returns
                                    </div>
                                    <div className="text-sm text-primary-foreground/70">
                                        30-day return policy
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-primary-foreground/60">
                        © {new Date().getFullYear()} {siteConfig.name}. All
                        rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex flex-1 items-center justify-center bg-background p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-2 lg:hidden"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-2xl">🍃</span>
                        </div>
                        <span className="text-xl font-bold">
                            {siteConfig.name}
                        </span>
                    </Link>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Create an account
                        </h2>
                        <p className="text-muted-foreground">
                            Get started with your free account today
                        </p>
                    </div>

                    <SignUpForm />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        By signing up, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
