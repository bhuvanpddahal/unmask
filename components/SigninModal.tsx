"use client";

import Link from "next/link";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";
import { useSigninModal } from "@/hooks/useSigninModal";

const SigninModal = () => {
    const { isOpen, pathToRedirect, close } = useSigninModal();

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">
                        <Image
                            src="/logo-light.svg"
                            alt="Logo"
                            height={35}
                            width={116}
                            className="h-[35px] w-auto dark:hidden"
                            priority
                        />
                        <Image
                            src="/logo-dark.svg"
                            alt="Logo"
                            height={35}
                            width={116}
                            className="hidden h-[35px] w-auto dark:inline-block"
                            priority
                        />
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        <h1 className="text-base text-zinc-900 dark:text-zinc-100 font-bold">
                            Join the community to participate in the discussion
                        </h1>
                        <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-2">
                            Get full access to industry posts and comments.
                            <br />
                            Connect anonymously with coworkers.
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-col space-y-2 sm:space-x-0 mt-2">
                    <Link
                        href={`/signup?redirectTo=${pathToRedirect}`}
                        className={cn(buttonVariants({
                            size: "lg"
                        }))}
                        onClick={close}
                    >
                        Sign up
                    </Link>
                    <Link
                        href={`/signin?redirectTo=${pathToRedirect}`}
                        className={cn(buttonVariants({
                            size: "lg",
                            variant: "ghost",
                            className: "bg-slate-200 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                        }))}
                        onClick={close}
                    >
                        Sign in
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default SigninModal;