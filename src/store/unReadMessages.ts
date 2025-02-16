import { create } from "zustand";

type State = {
    unreadMessages: Map<string, number>;
    setUnreadMessage: (userId: string, count?: number) => void;
};

const useUnreadMessagesStore = create<State>((set) => ({
    unreadMessages: new Map(),
    setUnreadMessage: (userId: string, count?: number) =>
        set((state) => {
            const newUnreadMessages = new Map(state.unreadMessages); // Create a new map
            newUnreadMessages.set(userId, count ?? (newUnreadMessages.get(userId) || 0) + 1);

            console.log(`Updating unread messages for ${userId}:`, count ?? (newUnreadMessages.get(userId) || 0) + 1);

            return { unreadMessages: newUnreadMessages }; // Return a new state object
        }),
}));

export default useUnreadMessagesStore;
