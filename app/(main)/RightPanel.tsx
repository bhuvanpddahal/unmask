import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/Card";

const RightPanel = () => {
    return (
        <div className="sticky top-[60px] h-fit p-4 pl-0">
            <Card className="w-[330px] p-4">
                <div className="text-zinc-500 text-sm font-semibold tracking-tight mb-2">
                    For You
                </div>
                <div className="bg-primary rounded-sm p-4 space-y-4">
                    <p className="text-primary-foreground text-xl font-semibold">
                        Join the Unmask community, and share your experiences anonymously
                    </p>
                    <Button className="w-full bg-white text-primary hover:bg-zinc-100">
                        Sign up
                    </Button>
                </div>
            </Card>
        </div>
    )
};

export default RightPanel;