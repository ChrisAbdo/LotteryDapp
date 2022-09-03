import React from "react";
import Image from "next/image";
import NavButton from "./NavButton";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";

function Header() {
  const address = useAddress();
  const disconnect = useDisconnect();
  return (
    <header className="navbar grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
      <div className="flex items-center space-x-2">
        <div>
          <h1 className="text-lg text-white font-bold">DrawRooms💸</h1>
          <p className="text-xs text-emerald-500 truncate">
            Signed In As: {address?.substring(0, 5)}...
            {address?.substring(address.length, address.length - 4)}
          </p>
        </div>
      </div>

      <div className="hidden md:flex md:col-span-3 items-center justify-center rounded-md">
        <div className="bg-[#0A1F1C] p-4 space-x-2">
          <NavButton isActive title="Buy Tickets" />
          <NavButton title="Search for draws..." />
        </div>
      </div>

      <div className="flex flex-col ml-auto text-right">
        <button
          onClick={disconnect}
          className="btn btn-outline btn-ghost rounded-none"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
export default Header;
