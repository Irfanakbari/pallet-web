"use client";
import { Dropdown } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@/const/menu";
import useTabStore, { Tab, TabStore } from "@/app/context/Tab/TabStore";
import useStore from "@/app/context/Tab/useStore";


interface MainMenuProps {
    title: string;
    data: Menu[];
}

const MainMenu: React.FC<MainMenuProps> = ({title, data}) => {
    // const dispatch = useDispatch();
    // const tabs = useSelector((state: RootState) => state.tabs);
    // const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
    const router = useRouter()
  const tabStore : TabStore| any = useStore(useTabStore, (state) => state)

    const handleAddTab = (key: any) => {
        const selectedMenuItem = data.find((menuItem) => menuItem.key === key.key);
        const newTab: Tab = {
            id: selectedMenuItem?.key!,
            label: selectedMenuItem?.label!,
            path: selectedMenuItem?.path!,
        };
         tabStore?.addTab(newTab)
        // dispatch(setActiveTab(newTab));

        // Use Next.js router.push() to navigate to the new path
        router.push( selectedMenuItem?.path!);
    };

    return (
        <Dropdown
            menu={{
                items: data,
                onClick: (key) => handleAddTab(key)
            }}
            placement="bottom"
        >
            <span className={`border-gray-500 border-r hover:bg-[#85d3ff] hover:cursor-pointer px-4`}>{title}</span>
        </Dropdown>
    );
}

export default MainMenu