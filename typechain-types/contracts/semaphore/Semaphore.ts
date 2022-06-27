/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface SemaphoreInterface extends utils.Interface {
  functions: {
    "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "verifyProof"
      | "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "verifyProof",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "verifyProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])",
    data: BytesLike
  ): Result;

  events: {
    "NullifierHashAdded(uint256)": EventFragment;
    "ProofVerified(uint256,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NullifierHashAdded"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "NullifierHashAdded(uint256)"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProofVerified"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "ProofVerified(uint256,bytes32)"
  ): EventFragment;
}

export interface NullifierHashAddedEventObject {
  nullifierHash: BigNumber;
}
export type NullifierHashAddedEvent = TypedEvent<
  [BigNumber],
  NullifierHashAddedEventObject
>;

export type NullifierHashAddedEventFilter =
  TypedEventFilter<NullifierHashAddedEvent>;

export interface ProofVerifiedEventObject {
  groupId: BigNumber;
  signal: string;
}
export type ProofVerifiedEvent = TypedEvent<
  [BigNumber, string],
  ProofVerifiedEventObject
>;

export type ProofVerifiedEventFilter = TypedEventFilter<ProofVerifiedEvent>;

export interface Semaphore extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SemaphoreInterface;

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
    verifyProof(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])"(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  verifyProof(
    groupId: PromiseOrValue<BigNumberish>,
    signal: PromiseOrValue<BytesLike>,
    nullifierHash: PromiseOrValue<BigNumberish>,
    externalNullifier: PromiseOrValue<BigNumberish>,
    proof: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])"(
    groupId: PromiseOrValue<BigNumberish>,
    signal: PromiseOrValue<BytesLike>,
    nullifierHash: PromiseOrValue<BigNumberish>,
    externalNullifier: PromiseOrValue<BigNumberish>,
    proof: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    verifyProof(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])"(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "NullifierHashAdded(uint256)"(
      nullifierHash?: null
    ): NullifierHashAddedEventFilter;
    NullifierHashAdded(nullifierHash?: null): NullifierHashAddedEventFilter;

    "ProofVerified(uint256,bytes32)"(
      groupId?: PromiseOrValue<BigNumberish> | null,
      signal?: null
    ): ProofVerifiedEventFilter;
    ProofVerified(
      groupId?: PromiseOrValue<BigNumberish> | null,
      signal?: null
    ): ProofVerifiedEventFilter;
  };

  estimateGas: {
    verifyProof(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])"(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    verifyProof(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    "verifyProof(uint256,bytes32,uint256,uint256,uint256[8])"(
      groupId: PromiseOrValue<BigNumberish>,
      signal: PromiseOrValue<BytesLike>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      externalNullifier: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
