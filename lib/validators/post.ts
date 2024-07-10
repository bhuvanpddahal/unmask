import { z } from "zod";

export const CreatePostValidator = z.object({
    title: z.string().min(20, {
        message: "Title must be at least 20 characters long"
    }),
    description: z.string().min(120, {
        message: "Description must be at least 120 characters long"
    }),
    image: z.string().optional(),
    pollOptions: z.array(z.string()).min(2, {
        message: "Poll must have at least 2 options"
    }).max(6, {
        message: "Poll must have at most 6 options"
    }).optional().refine((options) => {
        if (!options) return true;
        const hasEmptyOption = options.findIndex((option) => option === "");
        if (hasEmptyOption === -1) return true;
        return false;
    }, {
        message: "Option cannot be empty"
    })
});

export type CreatePostPayload = z.infer<typeof CreatePostValidator>;