import { useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

interface SortByProps {
    sort: string;
    postId?: string;
    className?: string;
}

const SortBy = ({
    sort,
    postId,
    className
}: SortByProps) => {
    const router = useRouter();

    const handleValueChange = (value: string) => {
        if (!postId) return;
        router.push(`/post/${postId}?sort=${value}`);
    };

    return (
        <div className={cn(
            "flex items-center justify-end gap-x-1 mb-2 focus:ring-0 focus:ring-transparent",
            className
        )}>
            <span className="text-xs font-medium">
                Sort by:
            </span>
            <Select
                value={sort}
                onValueChange={handleValueChange}
            >
                <SelectTrigger className="bg-transparent w-fit h-fit p-0 text-xs font-semibold border-none focus:ring-0 focus:ring-transparent">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-medium">
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
};

export default SortBy;