"use client";
import {signOut, useSession} from "next-auth/react";
import { TypeAnimation } from "react-type-animation";

export default function Block(){
  const {data: session} = useSession();
  

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-black">
        <h1 className="text-9xl text-white text-opacity-25 font-montserrat fixed w-full text-center z-10 transform -translate-y-1/2 top-1/2">403</h1>
        <div className="bg-transparent w-full md:w-full lg:w-3/4 p-8 rounded-lg shadow-xl z-20">
          <p className="font-mono text-gray-200 text-lg mb-6">&gt; <span className="text-yellow-400">ERROR CODE</span>: "
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'HTTP',
                'HTTP 403',
                'HTTP 403 FORBIDDEN',
              ]}
              wrapper="span"
              speed={40}
              style={{ display: 'inline-block', fontStyle: 'italic' }}
            />"</p>
          <p className="font-mono text-gray-200 text-lg mb-6">&gt; <span className="text-yellow-400">ERROR DESCRIPTION</span>: "
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Access Denied. You Do Not Have The Permission To Access This Page On This Server',
              ]}
              wrapper="span"
              speed={40}
              style={{ display: 'inline-block', fontStyle: 'italic' }}
            />
            "</p>
          <p className="font-mono text-gray-200 text-lg mb-6">&gt; <span className="text-yellow-400">ERROR POSSIBLY CAUSED BY</span>: [<b>You don't have the appropriate role to access this application, or you don't have permission to access it, please contact super admin to change the permissions on your account.</b>...]</p>
          {/*<p className="font-mono text-gray-200 text-lg mb-6">&gt; <span className="text-yellow-400">SOME PAGES ON THIS SERVER THAT YOU DO HAVE PERMISSION TO ACCESS</span>: [<a href="/" className="text-blue-500">Home Page</a>, <a href="/" className="text-blue-500">About Us</a>, <a href="/" className="text-blue-500">Contact Us</a>, <a href="/" className="text-blue-500">Blog</a>...]</p>*/}
          <p className="font-mono text-gray-200 text-lg">&gt; <span className="text-yellow-400">HAVE A NICE DAY {session?.user?.name?.toUpperCase()} :-)</span></p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>signOut()}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
