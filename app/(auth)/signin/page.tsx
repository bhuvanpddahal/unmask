import Link from "next/link";
import { Metadata } from "next";

import SigninForm from "./SigninForm";
import { Separator } from "@/components/ui/Separator";

interface SigninPageProps {
    searchParams: {
        redirectTo?: string;
    };
}

export const metadata: Metadata = {
    title: "Sign In"
};

const SigninPage = ({
    searchParams: { redirectTo }
}: SigninPageProps) => {
    return (
        <>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Welcome Back!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                We&apos;re happy to see you again! Dive back into exploring Unmask.
            </p>
            <SigninForm />
            <Separator />
            <p className="text-sm font-medium text-center mt-4">
                New to Unmask? {" "}
                <Link
                    href={`/signup${redirectTo ? `?redirectTo=${redirectTo}` : ""}`}
                    className="text-primary hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </>
    );
};

export default SigninPage;