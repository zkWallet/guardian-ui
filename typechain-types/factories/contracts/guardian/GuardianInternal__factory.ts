/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  GuardianInternal,
  GuardianInternalInterface,
} from "../../../contracts/guardian/GuardianInternal";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "hashId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "effectiveTime",
        type: "uint256",
      },
    ],
    name: "GuardianAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "hashId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "effectiveTime",
        type: "uint256",
      },
    ],
    name: "GuardianRemoved",
    type: "event",
  },
];

export class GuardianInternal__factory {
  static readonly abi = _abi;
  static createInterface(): GuardianInternalInterface {
    return new utils.Interface(_abi) as GuardianInternalInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GuardianInternal {
    return new Contract(address, _abi, signerOrProvider) as GuardianInternal;
  }
}
