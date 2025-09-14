import { UserProfile } from "@/components/user/profile/user-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile - B2C Marketplace",
    description: "Manage your profile information and settings.",
};

export default function ProfilePage() {
    return <UserProfile />;
}
