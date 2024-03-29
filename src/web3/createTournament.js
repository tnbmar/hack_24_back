import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "./abi.js";

const createTournament = async () => {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);

  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  // const res = await client.writeContract({
  //   address: "0x5E1a290d299e71eB988bAd553742BccE35776E06",
  //   abi,
  //   functionName: "createTournament",
  //   args: ["test"],
  //   value: BigInt("1000000"),
  // });
};

export default createTournament;
