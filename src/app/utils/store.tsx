import { createStore } from 'zustand';

type AppStore = {
	members: string[];
	utils: {
		members: {
			add: (id: string) => void;
			remove: (id: string) => void;
			set: (ids: string[]) => void;
		};
	};
};

const appStore = createStore<AppStore>((set) => ({
	members: [],
	utils: {
		members: {
			add: (id) => set((state) => ({ members: [...state.members, id] })),
			remove: (id) =>
				set((state) => ({
					members: state.members.filter((memberId) => memberId !== id)
				})),
			set: (ids) => set({ members: ids })
		}
	}
}));

export default appStore;
