import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex">
            <div className="max-w-2xl w-[40%] bg-black hidden lg:flex lg:flex-col lg:justify-center lg:gap-y-8 pt-10 pl-5 pb-10 overflow-hidden">
                <div className="pr-5">
                    <h2 className="text-lg text-primary font-medium">
                        Unmask - Anonymous and Professional Community
                    </h2>
                    <p className="text-sm text-zinc-300">
                        Share your experiences, thoughts, and feelings - completely anonymously. Whether you want to celebrate a victory, vent about a frustration, or simply connect with others who understand, Unmask provides a supportive and judgement-free community.
                    </p>
                </div>
                <Image
                    src="/thumbnail.png"
                    alt="Image displaying Unmask"
                    height={400}
                    width={1012}
                    className="w-full h-auto"
                    priority
                />
            </div>
            <div className="flex-1 bg-background flex items-center justify-center p-6">
                <div className="max-w-sm w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;