import { useMetamask } from "@thirdweb-dev/react";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { themeChange } from "theme-change";

function Login() {
  const connectWithMetamask = useMetamask();

  return (
    <div className="bg-black">
      <Navbar />
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-black min-h-screen flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-6xl text-emerald-500 font-bold">DrawRooms💸</h1>
          <h2 className="text-xl  font-bold mt-2 mb-4">
            the most efficient web3 lottery system
          </h2>

          <button
            onClick={connectWithMetamask}
            className="btn btn-outline btn-ghost"
          >
            login with metamask
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
