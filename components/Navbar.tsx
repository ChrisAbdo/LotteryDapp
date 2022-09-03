// Import Next / React dependencies
import { useEffect } from "react";
import { useMetamask } from "@thirdweb-dev/react";

// Import external dependencies
import { themeChange } from "theme-change";

const Navbar = () => {
  const themeValues = ["Black", "Corporate", "Cyberpunk", "Lofi", "Business"];

  const zero = parseInt("0");

  useEffect(() => {
    themeChange(false);
  });

  const connectWithMetamask = useMetamask();

  return (
    <div className="navbar">
      <div className="flex-1">
        <a
          href="/"
          className="btn btn-ghost btn-outline rounded-none normal-case text-xl "
        >
          DrawRooms💸
        </a>
      </div>
      <div className="">
        <button
          onClick={connectWithMetamask}
          className=" btn btn-outline btn-ghost rounded-none"
        >
          login with metamask
        </button>
        <div className="dropdown dropdown-end"></div>
      </div>
      <div className="modal" id="disconnect">
        <div className="modal-box">
          <h3 className="font-bold text-lg">To Disconnect:</h3>
          <p className="py-4">
            Open Metamask, click on the{" "}
            <span className="badge badge-success gap-2">connected</span> button
            and disconnect your wallet.
          </p>
          <div className="modal-action">
            <a href="#" className="btn">
              Close
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
