// import {configureStore} from '@reduxjs/toolkit';
// import tabReducer from "./TabReducer";
//
// const store = configureStore({
//     reducer: {
//         tabs: tabReducer,
//     },
// });
//
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
//
// export default store;
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Tab {
    path: string;
    label: string;
    id: string;
}

export interface TabStore {
    tabs: Tab[];
    activeTab: Tab | null;
    addTab: (tab: Tab) => void;
    closeTab: (tabId: string) => void;
    setActiveTab: (tab: Tab) => void;
}

const useTabStore = create<TabStore | any>(
  persist(
  (set, get) => (
       {
          tabs: [{
              path: '/',
              label: 'Dashboard',
              id: 'Dashboard'
          }],
          activeTab: {
              path: '/',
              label: 'Dashboard',
              id: 'Dashboard'
          },
          addTab: (tab: Tab) => set((state: TabStore) => {
              const existingTabIndex = state.tabs.findIndex((existingTab: Tab) => existingTab.id === tab.id);
              if (existingTabIndex !== -1) {
                  // Jika tab sudah ada, set activeTab ke tab yang sudah ada
                  return {
                      tabs: state.tabs,
                      activeTab: state.tabs[existingTabIndex]
                  };
              }

              // Jika tab belum ada, tambahkan tab baru dan set activeTab ke tab baru
              return {
                  tabs: [...state.tabs, tab],
                  activeTab: tab
              };
          }),
          closeTab: (tabId: string) => set((state: TabStore) => {
              const updatedTabs = state.tabs.filter((tab: Tab) => tab.id !== tabId);
              const newActiveTab = updatedTabs[0]; // Tab pertama setelah menutup tab

              return {
                  tabs: updatedTabs,
                  activeTab: newActiveTab
              };
          }),
          setActiveTab: (tab: Tab) => set((state: TabStore) => {
              return { activeTab: state.tabs.find((tabs: Tab) => tabs.id === tab.id) || null }
          }),
      }
  ),
    {
        name: 'tab-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
));

export default useTabStore;

