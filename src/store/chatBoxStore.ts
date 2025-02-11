import { create } from "zustand";

type chatBox =  string | undefined;


type State = {
    chatBox: chatBox | undefined;
    setChatBox: (chatBox: chatBox) => void;
}

const useChatBoxStore = create<State>((set) => ({
    chatBox: undefined,
    setChatBox: (chatBox: chatBox) => set({ chatBox }),
}))

export default useChatBoxStore;