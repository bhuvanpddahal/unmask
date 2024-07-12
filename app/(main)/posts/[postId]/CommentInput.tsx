import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";

const CommentInput = () => {
    return (
        <Card className="sticky bottom-0 p-4 mt-5">
            <div className="bg-zinc-50 border rounded-md">
                <Textarea
                    rows={2}
                    placeholder="Add a comment"
                    className="border-0 min-h-fit font-medium focus-visible:ring-0 focus-visible:ring-transparent"
                />
                <div className="text-right p-2">
                    <Button
                        variant="ghost"
                    >
                        Cancel
                    </Button>
                    <Button>
                        Post
                    </Button>
                </div>
            </div>
        </Card>
    )
};

export default CommentInput;

export const CommentInputLoader = () => (
    <Card className="sticky bottom-0 p-4 mt-5">
        <Skeleton className="bg-zinc-100 w-full">
            <div className="h-[56px] w-full" />
            <div className="text-right p-2">
                <Skeleton className="bg-slate-200/50 inline-block h-9 w-[76px]" />
                <Skeleton className="bg-slate-200/50 inline-block h-9 w-[60px]" />
            </div>
        </Skeleton>
    </Card>
);