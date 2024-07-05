import Link from "next/link";

import SigninForm from "./SigninForm";
import { Separator } from "@/components/ui/Separator";

export const metadata = {
    title: "Sign In - Unmask"
};

const SigninPage = () => {
    return (
        <>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Join the Unmask Community
            </h1>

            <SigninForm />

            <Separator />

            <p className="text-sm font-medium text-center mt-4">
                New to Unmask?
                <Link href="/signup" className="text-primary hover:underline"> Sign up</Link>
            </p>
        </>
    )
};

export default SigninPage;