import Image from "next/image";

import Poll from "./Poll";
import { CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface PostContentProps {
    title: string;
    description: string;
    postImage: string | null;
}

const PostContent = ({
    title,
    description,
    postImage
}: PostContentProps) => {
    return (
        <CardContent className="px-4 py-0">
            <h3 className="font-semibold text-xl text-black mb-2">
                {title}
            </h3>
            <p className="text-sm font-medium text-zinc-800">
                {description}
            </p>
            {postImage && (
                <div className="relative h-[350px] w-full border mt-4">
                    <Image
                        src={postImage}
                        alt="Post Image"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
            {/* <Poll /> */}
        </CardContent>
    )
};

export default PostContent;

export const PostContentLoader = () => (
    <CardContent className="px-4 py-0">
        <div className="py-1 mb-2">
            <Skeleton className="h-5 w-[300px]" />
        </div>
        <div className="py-[3px] space-y-1.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-20" />
        </div>
    </CardContent>
);