import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import Providers from "@/components/Providers";
import { auth } from "@/auth";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Unmask",
    description: "Unmask is a safe space to share your experiences, thoughts, and feelings - completely anonymously. Whether you want to celebrate a victory, vent about a frustration, or simply connect with others who understand, Unmask provides a supportive and judgement-free community.",
    icons: {
        icon: "/logo-icon.png"
    }
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="en">
            <body className={plusJakartaSans.className}>
                <Providers session={session}>
                    {children}
                </Providers>
            </body>
        </html>
    )
}