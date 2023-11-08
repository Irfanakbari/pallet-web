"use client";
import { ImCross } from "react-icons/im";
import React from "react";
import HeadTitle from "../Head/HeadTitle";
import MainMenu from "../Menu/MainMenu";
import useTabStore, { Tab, TabStore } from "../../context/Tab/TabStore";
import { useRouter } from "next/navigation";
import useStore from "@/app/context/Tab/useStore";
import {  laporan, master } from "@/const/menu";


export default function MainLayout({children}: {children: any}) {
    const router = useRouter(); // Menggunakan router Home.js
    const tabStore : TabStore| any = useStore(useTabStore, (state) => state)
    

    function handleActive(tab: Tab) {
        tabStore?.setActiveTab(tab)
        router.replace(tab.path)
    }

    function handleCloseTab(tabId: string){
        tabStore?.closeTab(tabId)
        router.replace('/')
    }


    return (
        <>
            <div className={`border p-1.5 border-gray-500 flex flex-col h-screen`}>
                <HeadTitle/>
                <div className={`py-2`}>
                    <div className={`w-full py-1.5 flex bg-[#EBEBEB] text-sm font-semibold`}>
                        <MainMenu data={master} title={'Master Data'}/>
                        <MainMenu data={laporan} title={'Laporan'}/>
                        {/*<MainMenu data={delivery} title={'Delivery'}/>*/}

                    </div>
                </div>
                <div className={`bg-base w-full mt-2 flex pt-1 px-1`}>
                    {
                        tabStore?.tabs.map((tab: Tab) => {
                            return (
                                <div
                                    key={tab.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleActive(tab);
                                    }}                                    className={`${tabStore?.activeTab?.id === tab.id ? "bg-white text-black" : "text-white"}  justify-evenly gap-2 flex items-center bg-[#2589ce] py-1 px-3 text-sm font-bold mr-2 hover:bg-white hover:text-black hover:cursor-pointer`}
                                    style={{flexShrink: 0}}>
                                        {tab.label}
                                     {
                                    tab.label !== 'Dashboard' &&
                                    <div className={`z-10 p-1 bg-red-500 right-0 top-0`}  onClick={(e) => {
                                        e.stopPropagation();
                                        handleCloseTab(tab.id)
                                    }}>
                                        <ImCross className={`z-10`} size={10} />
                                    </div>
                                }
                                </div>
                            )
                        })
                    }
                </div>

                <div className="w-full bg-white p-2 h-full">
                    {
                        children
                    }
                </div>
            </div>
        </>
    )
}
