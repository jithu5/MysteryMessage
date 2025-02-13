import { create } from "zustand";

type Message = {
    sender: string;
    receiver: string;
    content: string;
    createdAt: Date;
    roomId: string;
    _id:string;
}


interface ChatState {
    messages: Message[];
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
}

const useChatStore = create<ChatState>((set) => ({
    messages: [],
    addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
    setMessages: (messages: Message[]) => set({ messages }),
}));

export default useChatStore;