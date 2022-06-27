/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface ISimplicyWalletDiamondInterface extends utils.Interface {
  functions: {
    "version()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "version" | "version()"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "version", values?: undefined): string;
  encodeFunctionData(functionFragment: "version()", values?: undefined): string;

  decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "version()", data: BytesLike): Result;

  events: {};
}

export interface ISimplicyWalletDiamond extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ISimplicyWalletDiamondInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    version(overrides?: CallOverrides): Promise<[string]>;

    "version()"(overrides?: CallOverrides): Promise<[string]>;
  };

  version(overrides?: CallOverrides): Promise<string>;

  "version()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    version(overrides?: CallOverrides): Promise<string>;

    "version()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    version(overrides?: CallOverrides): Promise<BigNumber>;

    "version()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    version(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "version()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
