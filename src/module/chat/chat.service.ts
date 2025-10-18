import { Request, Response } from "express"
import { ChatRepository } from "../../DB"

class ChatService {
    private readonly chatRepository = new ChatRepository()
    getChat = async (req: Request, res: Response) => {
        const { userId } = req.params
        const loggedUser = req.user._id
        const chat = await this.chatRepository.getOne({ users: { $all: [loggedUser, userId] } }, {},
            { populate: [{ path: "messages" }] })
        
        if (!chat) {
            return res.status(200).json({ message: "empty chat", success: true, data: null })
        }
        return res.status(200).json({ message: "done", success: true, data: chat })
    }
}

export default new ChatService()
