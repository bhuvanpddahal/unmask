"use client";

import Link from "next/link";
import {
    Dot,
    Ellipsis,
    Eye,
    Heart,
    MessageSquare,
    Share
} from "lucide-react";
import { useRouter } from "next/navigation";

import UserAvatar from "@/components/UserAvatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/Card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

const Posts = () => {
    const router = useRouter();

    return (
        <div>
            <div className="text-sm text-right mb-2">
                Sort by: Hot
            </div>
            <ul className="space-y-5">
                {([...new Array(5)]).map((_, index) => (
                    <Card
                        key={index}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => router.push("/posts/123")}
                    >
                        <CardHeader className="p-4">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <UserAvatar
                                        image=""
                                        username="Jpayotei"
                                    />
                                    <div>
                                        <p className="text-[13px] flex items-center gap-0.5">
                                            <Link
                                                href="/"
                                                className="text-accent-foreground font-semibold hover:underline"
                                            >
                                                Jpayotei
                                            </Link>
                                            <Dot className="size-4" />
                                            <span className="text-xs text-zinc-400 font-semibold">
                                                Yesterday
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent">
                                        <Ellipsis className="size-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Copy link</DropdownMenuItem>
                                        <DropdownMenuItem>Embed post</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 py-0">
                            <h3 className="font-semibold text-accent-foreground line-clamp-1 mb-2">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium, aperiam!
                            </h3>
                            <p className="text-[13.5px] font-medium text-zinc-700 line-clamp-3">
                                If I could go back to college, I'd vigorously pursue investment banking or corporate law. I’d be making $1m at age 30 and $10m at age 40. And my colleagues would be mostly Americans instead of immigrants whom I don’t enjoy working with.  EDIT: should mention I went to an Ivy League college, which do with the money that I have?
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-6">
                            <div className="w-full flex justify-between">
                                <div className="flex gap-3 text-sm">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                                        <Heart className="size-3" />
                                        13
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                                        <MessageSquare className="size-3" />
                                        39
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                                        <Eye className="size-3" />
                                        698
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 rounded-full hover:bg-accent">
                                    <Share className="size-3" />
                                    Share
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </ul>
        </div>
    )
};

export default Posts;