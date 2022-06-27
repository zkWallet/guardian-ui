import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

export function formatEtherscanLink(
  type: "Account" | "Transaction",
  data: [number | any, string]
) {
  const [chainId] = data;
  let baseUrl: string;

  switch (chainId) {
    case 1666900000: {
      baseUrl = "https://explorer.ps.hmny.io";
      break;
    }
    case 1666700000: {
      baseUrl = "https://explorer.pops.one";
      break;
    }
    default: {
      baseUrl = "https://explorer.harmony.one";
      break;
    }
  }
  switch (type) {
    case "Account": {
      const [address] = data;
      return `${baseUrl}/address/${address}`;
    }
    case "Transaction": {
      const [hash] = data;
      return `${baseUrl}/tx/${hash}`;
    }
  }
}

export const parseBalance = (
  value: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 3
) => parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);
