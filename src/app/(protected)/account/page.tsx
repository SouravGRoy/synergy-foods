import { CustomerAccount } from "@/components/customer/account";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <CustomerAccount />
        </div>
    );
}
