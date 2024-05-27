import Link from "next/link";
import { Check, SendHorizonal } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

const HeroSection = () => {
    return (
        <div className="bg-primary-foreground">
            <div className="relative max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-12 lg:py-32">
                <div className="relative flex flex-col gap-10 lg:gap-12 items-center justify-center text-center">
                    <div className="space-y-2">
                        <div className="inline-flex justify-center items-center bg-muted text-xs text-zinc-800/70 font-medium px-1.5 py-0.5 border border-primary/40 rounded-full">
                            Get a smooth start
                        </div>
                        <h1 className="font-extrabold text-zinc-800 text-4xl lg:text-6xl tracking-tight leading-[50px] lg:leading-[75px] md:-mb-4">
                            Quickly setup your project
                            <br />
                            with preconfigured assets
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
                        Focus directly on the core features rather than building the same features all over again. Leave the hassle behind, be more productive, let the ideas flourish.
                    </p>
                    <ul className="text-slate-600 leading-relaxed space-y-1">
                        <li className="flex items-center justify-center lg:justify-start gap-2">
                            <Check className="h-4 w-4 text-emerald-500" />
                            Authentication with Auth.js
                        </li>
                        <li className="flex items-center justify-center lg:justify-start gap-2">
                            <Check className="h-4 w-4 text-emerald-500" />
                            Email verification
                        </li>
                        <li className="flex items-center justify-center lg:justify-start gap-2">
                            <Check className="h-4 w-4 text-emerald-500" />
                            Protected dashboard page
                        </li>
                    </ul>
                    <Link href="/#pricing" className={cn(
                        buttonVariants(),
                        "group h-12 px-[50px] gap-2"
                    )}>
                        Get QuickCodeKit
                        <SendHorizonal className="h-4 w-4 stroke-2 group-hover:translate-x-0.5 group-hover:fill-white/20 transition-transform duration-200" />
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default HeroSection;