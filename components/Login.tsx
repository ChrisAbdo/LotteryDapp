import { useMetamask } from "@thirdweb-dev/react";
import React from "react";

function Login() {
  const connectWithMetamask = useMetamask();
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <img
          className="rounded-full h-56 wo-56 mb-10"
          src="http://i.imgur.com/4h7mAu7.png"
          alt=""
        />
        <h1 className="text-6xl text-white font-bold">0xAbdo draw</h1>
        <h2 className="text-2xl text-white font-bold">
          get started by connecting your wallet
        </h2>

        <button
          onClick={connectWithMetamask}
          className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold"
        >
          login with metamask
        </button>
      </div>
    </div>
  );
}

export default Login;
