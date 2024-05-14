import Image from "next/image";

import SigninForm from "./SigninForm";
import SocialButtons from "./SocialButtons";
import { Separator } from "@/components/ui/Separator";

const SigninPage = () => {
    return (
        <div className="min-h-screen w-full bg-muted flex items-center justify-center px-2 py-4">
            <div className="bg-white max-w-sm w-full px-6 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-9 rounded-[30px] shadow-sm">
                <div className="flex items-center justify-center">
                    <Image
                        src="logo.svg"
                        alt="Logo"
                        height={48.88}
                        width={40}
                        className="w-[40px] h-auto"
                    />
                    <span className="font-extrabold text-zinc-800 text-lg">
                        QuickCodeKit
                    </span>
                </div>

                <SigninForm />

                <Separator className="flex items-center justify-center my-6">
                    <span className="bg-white px-3 text-slate-300 text-sm select-none">
                        or
                    </span>
                </Separator>

                <SocialButtons />
            </div>
        </div>
    )
};

export default SigninPage;