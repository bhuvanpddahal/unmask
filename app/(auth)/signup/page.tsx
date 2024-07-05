import Link from "next/link";

import SigninForm from "../signin/SigninForm";
import { Separator } from "@/components/ui/Separator";

export const metadata = {
    title: "Sign In - QuickCodeKit"
};

const SignupPage = () => {
    return (
        <>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Welcome Back!
            </h1>

            <SigninForm />

            <Separator />

            <p className="text-sm font-medium text-center mt-4">
                Already a member?
                <Link href="/signin" className="text-primary hover:underline"> Sign in</Link>
            </p>
        </>
    )
};

export default SignupPage;