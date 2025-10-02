import { CreateCommentDTO } from "./comment.dto";
import { z } from "zod";

export const commentValidation = z.object<CreateCommentDTO>({
    content: z.string().min(1).max(280) as unknown as string,
    // TODO: attachments validation
})
