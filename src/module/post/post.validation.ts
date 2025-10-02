import { CreatePostDTO } from "./post.dto";
import { z } from "zod";

export const postValidation = z.object<CreatePostDTO>({
    content: z.string().min(1).max(280) as unknown as string,
    // TODO: attachment validation
})