import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

interface FormErrorProps {
    message?: string;
    className?: string;
}

const FormError = ({
    message,
    className
}: FormErrorProps) => {
    if (!message) return null;

    return (
        <div className={cn(
            "w-full bg-destructive/15 dark:bg-destructive/50 px-3 py-2 rounded-md flex items-center gap-x-2 text-sm text-destructive dark:text-destructive-foreground max-w-4xl",
            className
        )}>
            <TriangleAlert className="h-4 w-4 flex-shrink-0" />
            <p>{message}</p>
        </div>
    );
};

export default FormError;