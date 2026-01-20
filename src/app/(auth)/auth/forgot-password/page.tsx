import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
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
                            Forgot your password?
                        </h1>
                        <p className="text-lg text-primary-foreground/80">
                            No worries! Enter your email and we&apos;ll send you
                            reset instructions.
                        </p>
                    </div>

                    <div className="text-sm text-primary-foreground/60">
                        © {new Date().getFullYear()} {siteConfig.name}. All
                        rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Reset Form */}
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

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Reset password
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Enter your email address and we&apos;ll send you
                                a link to reset your password.
                            </p>
                        </div>

                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="h-11"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full text-base"
                            >
                                Send reset link
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            <Link
                                href="/auth/signin"
                                className="font-medium text-primary hover:underline"
                            >
                                ← Back to sign in
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground">
                            <strong>Note:</strong> Password reset functionality
                            is managed through Clerk. Please contact support if
                            you need assistance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
