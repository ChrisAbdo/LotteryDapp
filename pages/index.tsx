import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  useContractCall,
  useContractData,
  useDisconnect,
  useMetamask,
} from "@thirdweb-dev/react";
import Login from "../components/Login";
import PropagateLoader from "react-spinners/PropagateLoader";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { currency } from "../constants";
import CountdownTimer from "../components/CountdownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/AdminControls";

const Home: NextPage = () => {
  const address = useAddress();

  const [userTickets, setUserTickets] = useState(0);

  const [quantity, setQuantity] = useState<number>(1);

  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );

  const { data: remainingTickets } = useContractData(
    contract,
    "RemainingTickets"
  );

  const { data: currentWinningReward } = useContractData(
    contract,
    "CurrentWinningReward"
  );

  const { data: ticketPrice } = useContractData(contract, "ticketPrice");

  const { data: ticketCommission } = useContractData(
    contract,
    "ticketCommission"
  );

  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets");

  const { data: expiration } = useContractData(contract, "expiration");

  const { data: tickets } = useContractData(contract, "getTickets");

  const { data: winnings } = useContractData(
    contract,
    "getWinningsForAddress",
    address
  );

  const { mutateAsync: WithdrawWinnings } = useContractCall(
    contract,
    "WithdrawWinnings"
  );

  const { data: lastWinner } = useContractData(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractData(
    contract,
    "lastWinnerAmount"
  );

  const { data: isLotteryOperator } = useContractData(
    contract,
    "lotteryOperator"
  );

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );

    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  console.log(userTickets);

  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your tickets...");

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);

      toast.success("Tickets bought successfully!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });

      console.error("contract call failure", err);
    }
  };

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing your winnings...");
    try {
      const data = await WithdrawWinnings([{}]);

      toast.success("Winnings withdrawn successfully!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });

      console.error("contract call failure", err);
    }
  };

  // returns loading screen if contract is loading
  if (isLoading) return <Loading />;

  // login screen auth
  if (!address) return <Login />;

  return (
    <div className="fonts bg-black min-h-screen flex flex-col">
      <Head>
        <title>Lottery</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="http://fonts.cdnfonts.com/css/retroica" rel="stylesheet" />
      </Head>

      <Header />
      <Marquee className="bg-[#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
        <div className="flex space-x-2 mx-10">
          <h4 className="text-white font-bold mr-4">
            Last Winner: {lastWinner?.toString()}
          </h4>
          <h4 className="text-white font-bold">
            Previous winnings:{" "}
            {lastWinnerAmount &&
              ethers.utils.formatEther(lastWinnerAmount?.toString())}
            {""} {currency}
          </h4>
        </div>
      </Marquee>

      {isLotteryOperator === address && (
        <div className="flex justify-center">
          <AdminControls />
        </div>
      )}

      {winnings > 0 && (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
          <button
            onClick={onWithdrawWinnings}
            className="p-5 mb-4 bg-emerald-700 hover:bg-emerald-500/50 animate-pulse text-center rounded-xl w-full"
          >
            <p className="font-bold">Winner!</p>
            <p>
              Total Winnings: {ethers.utils.formatEther(winnings.toString())}
              {""} {currency}
            </p>
            <br />
            <p className="font-bold">Click here to withdraw</p>
          </button>
        </div>
      )}

      {/* <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 max-w-5xl">
        <div className="stats-container">
          <h1 className="text-5xl text-white font-semibold text-center">
            The Next Draw
          </h1>
          <div className="flex justify-between p-2 space-x-2">
            <div className="stats">
              <h2 className="text-sm">Total Pool</h2>
              <p className="text-xl">
                {currentWinningReward &&
                  ethers.utils.formatEther(
                    currentWinningReward.toString()
                  )}{" "}
                {currency}
              </p>
            </div>
            <div className="stats">
              <h2 className="text-sm">Tickets Remaining</h2>
              <p className="text-xl">{remainingTickets?.toNumber()}</p>
            </div>
          </div>
          <div className="mt-5 mb-3">
            <CountdownTimer />
          </div>
        </div>
      </div> */}

      <div className="stats-container">
        <h1 className="text-5xl text-white font-semibold text-center">
          current draw:
        </h1>
        <div className="flex justify-between p-2 space-x-2">
          {/* <div className="stats">
            <h2 className="text-sm">Total Pool</h2>
            <p className="text-xl">
              {currentWinningReward &&
                ethers.utils.formatEther(currentWinningReward.toString())}{" "}
              {currency}
            </p>
          </div> */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title lg:stat-title md:text-xl sm:text-xl xs: text-sm font-bold">
                Total Pool
              </div>
              <div className="stat-value lg:stat-value md:text-xl sm:text-xl xs: text-sm">
                {currentWinningReward &&
                  ethers.utils.formatEther(
                    currentWinningReward.toString()
                  )}{" "}
                {currency}
              </div>
            </div>
          </div>
          {/* <div className="stats">
            <h2 className="text-sm">Tickets Remaining</h2>
            <p className="text-xl">{remainingTickets?.toNumber()}</p>
          </div> */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title lg:stat-title md:text-xl sm:text-xl xs: text-sm font-bold ">
                Tickets left:
              </div>
              <div className="stat-value lg:stat-value md:text-xl sm:text-xl xs: text-sm">
                {remainingTickets?.toNumber()}
              </div>
            </div>
          </div>
        </div>
        <div>
          <CountdownTimer />
        </div>
      </div>

      <div className="stats-container space-y-2">
        <div className="stats-container">
          <h1 className="text-5xl text-white font-semibold text-center">
            purchase tickets
          </h1>
          <div className="flex justify-between items-center text-white pb-2">
            <h2>Price per ticket</h2>
            <p>
              {ticketPrice && ethers.utils.formatEther(ticketPrice.toString())}{" "}
              {currency}
            </p>
          </div>

          <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
            <p>TICKETS</p>
            <input
              className="flex w-full bg-transparent text-right outline-none"
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2 mt-5">
            <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
              <p>Total cost of tickets</p>
              <p>
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity}{" "}
                {currency}
              </p>
            </div>

            <div className="flex items-center justify-between text-emerald-300 text-xs italic">
              <p>Service Fees</p>
              <p>
                {ticketCommission &&
                  ethers.utils.formatEther(ticketCommission.toString())}{" "}
                {currency}
              </p>
            </div>

            <div className="flex items-center justify-between text-emerald-300 text-xs italic">
              <p>+ Network Fees</p>
              <p>TBC</p>
            </div>
          </div>

          <button
            onClick={handleClick}
            disabled={
              expiration?.toString() < Date.now().toString() ||
              remainingTickets?.toNumber() === 0
            }
            className="font-semibold mt-5 w-full bg-gradient-to-r
            from-green-500
            via-orange-500
            to-green-500
            background-animate px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
          >
            Buy {quantity} ticket&#40;s&#41; for{" "}
            {ticketPrice &&
              Number(ethers.utils.formatEther(ticketPrice.toString())) *
                quantity}{" "}
            {currency}
          </button>
        </div>

        {userTickets > 0 && (
          <div className="stats">
            <p> you have {userTickets} Tickets in this draw</p>

            <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
              {Array(userTickets)
                .fill("")
                .map((_, index) => (
                  <p
                    className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                    key={index}
                  >
                    {index + 1}
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
      <footer className="footer footer-center p-10 text-primary-content">
        <div>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
            className="inline-block fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p className="font-bold">
            DrawRooms💸 <br />
            the most efficient web3 lottery system
          </p>
          <p>Copyright © 2022 - All right reserved</p>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
