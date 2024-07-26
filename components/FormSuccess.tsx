import { CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface FormSuccessProps {
    message?: string;
    className?: string;
}

const FormSuccess = ({
    message,
    className
}: FormSuccessProps) => {
    if (!message) return null;

    return (
        <div className={cn(
            "w-full bg-emerald-500/15 dark:bg-emerald-500/30 px-3 py-2 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 dark:text-emerald-50 max-w-4xl",
            className
        )}>
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <p>{message}</p>
        </div>
    )
};

export default FormSuccess;