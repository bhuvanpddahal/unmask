import Image from "next/image";

import VerifyEmailContent from "./Content";

export const metadata = {
    title: "Verify Email - QuickCodeKit"
};

const VerifyEmailPage = () => {
    return (
        <div className="min-h-screen w-full bg-muted flex items-center justify-center px-2 py-4">
            <div className="bg-white max-w-sm w-full px-6 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-9 rounded-[30px] space-y-4 shadow-sm">
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

                <VerifyEmailContent />
            </div>
        </div>
    )
};

export default VerifyEmailPage;