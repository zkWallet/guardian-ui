/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  Pairing,
  PairingInterface,
} from "../../../../contracts/verifiers/Verifier16.sol/Pairing";

const _abi = [
  {
    inputs: [],
    name: "InvalidProof",
    type: "error",
  },
];

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220ac65be1bf19268439ee6bfec40fdf0f4dc91e53e5b1cfde3deeb4f2418abfb2364736f6c634300080e0033";

type PairingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PairingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Pairing__factory extends ContractFactory {
  constructor(...args: PairingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Pairing> {
    return super.deploy(overrides || {}) as Promise<Pairing>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Pairing {
    return super.attach(address) as Pairing;
  }
  override connect(signer: Signer): Pairing__factory {
    return super.connect(signer) as Pairing__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PairingInterface {
    return new utils.Interface(_abi) as PairingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Pairing {
    return new Contract(address, _abi, signerOrProvider) as Pairing;
  }
}
