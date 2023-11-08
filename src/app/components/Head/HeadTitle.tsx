"use client";
import { FaUserAlt } from "react-icons/fa";
import { BiSolidDownArrow } from "react-icons/bi";
import { useState } from "react";
import Image from "next/image";
import { Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";

async function keycloakSessionLogOut() {
    try {
        await fetch(`/api/auth/logout`, { method: "GET" });
    } catch (err) {
        console.error(err);
    }
}

export default function HeadTitle() {
    const [closeModal, setCloseModal] = useState(false);
    const {data: session} = useSession()

    return (
        <>
            {
                closeModal &&
                <div
                    className={`fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full text-center overflow-y-auto overflow-x-hidden outline-none`}>
                    <div className={`w-1/4 rounded bg-white`}>
                        <div className={`w-full bg-[#f17373] text-center font-bold py-1 text-white text-sm`}>
                            Konfirmasi Logout
                        </div>
                        <div className={`mt-6 mb-6`}>
                                <span className={`text-sm`}>
                                    Yakin Ingin Logout?
                                 </span>
                        </div>
                        <div className={`flex flex-row justify-center gap-2 p-5`}>
                            <button onClick={()=>  keycloakSessionLogOut().then(()=>signOut({callbackUrl:'/'}))}
                                    className={`bg-[#f17373] w-full text-white py-1 text-sm rounded`}>Logout
                            </button>
                            <button onClick={() => setCloseModal(false)}
                                    className={`border w-full border-gray-500 py-1 text-sm rounded`}>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
            {/* Bagian header */}
            <div className="w-full bg-base py-1.5 px-2 text-white flex flex-row justify-between items-center mb-2">
                {/* Logo dan nama perusahaan */}
                <div className="flex items-center gap-3">
                    <Image src="/images/img.png" alt="Logo" width={90} height={30}/>
                    <h2 className="font-bold text-[14px] hidden md:block">PT VUTEQ INDONESIA - Pallet Control System</h2>
                </div>
                <div className={`hover:cursor-pointer`}>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 'Logout',
                                    label: 'Logout',
                                    onClick: () => setCloseModal(true)
                                }
                            ]
                            // onClick: (d)=>setNewTab(d.key)
                        }}
                        placement="bottom"
                    >
                        <div className="flex flex-row items-center">
                            <FaUserAlt size={10}/>
                            <h2 className="font-bold text-[14px] mx-2">
                                Halo, {session?.user?.name ?? "-"}
                            </h2>
                            <BiSolidDownArrow size={10}/>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </>
    );
}
