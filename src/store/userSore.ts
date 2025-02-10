import {create} from "zustand"

type User = {
    username: string;
    email: string;
    isVerified: boolean;
    profileImage?: string;
}

type State = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useUserStore = create<State>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}))

export default useUserStore