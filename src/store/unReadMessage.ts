import { create } from "zustand";

type State = {
    messageCount: { [userId: string]: number };
    setMessageCount: (datra:{}) => void;
};

const useMessageCountStore = create<State>((set) => ({
    messageCount: {},
    setMessageCount: (data:{}) => set({ messageCount: data}),
}));

export default useMessageCountStore;


