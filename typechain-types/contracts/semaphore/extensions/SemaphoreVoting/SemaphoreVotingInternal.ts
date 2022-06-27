/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  Signer,
  utils,
} from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export interface SemaphoreVotingInternalInterface extends utils.Interface {
  functions: {};

  events: {
    "NullifierHashAdded(uint256)": EventFragment;
    "PollCreated(uint256,address)": EventFragment;
    "PollEnded(uint256,address,uint256)": EventFragment;
    "PollStarted(uint256,address,uint256)": EventFragment;
    "ProofVerified(uint256,bytes32)": EventFragment;
    "VoteAdded(uint256,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NullifierHashAdded"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "NullifierHashAdded(uint256)"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PollCreated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "PollCreated(uint256,address)"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PollEnded"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "PollEnded(uint256,address,uint256)"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PollStarted"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "PollStarted(uint256,address,uint256)"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProofVerified"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "ProofVerified(uint256,bytes32)"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VoteAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VoteAdded(uint256,bytes32)"): EventFragment;
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

export interface PollCreatedEventObject {
  pollId: BigNumber;
  coordinator: string;
}
export type PollCreatedEvent = TypedEvent<
  [BigNumber, string],
  PollCreatedEventObject
>;

export type PollCreatedEventFilter = TypedEventFilter<PollCreatedEvent>;

export interface PollEndedEventObject {
  pollId: BigNumber;
  coordinator: string;
  decryptionKey: BigNumber;
}
export type PollEndedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  PollEndedEventObject
>;

export type PollEndedEventFilter = TypedEventFilter<PollEndedEvent>;

export interface PollStartedEventObject {
  pollId: BigNumber;
  coordinator: string;
  encryptionKey: BigNumber;
}
export type PollStartedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  PollStartedEventObject
>;

export type PollStartedEventFilter = TypedEventFilter<PollStartedEvent>;

export interface ProofVerifiedEventObject {
  groupId: BigNumber;
  signal: string;
}
export type ProofVerifiedEvent = TypedEvent<
  [BigNumber, string],
  ProofVerifiedEventObject
>;

export type ProofVerifiedEventFilter = TypedEventFilter<ProofVerifiedEvent>;

export interface VoteAddedEventObject {
  pollId: BigNumber;
  vote: string;
}
export type VoteAddedEvent = TypedEvent<
  [BigNumber, string],
  VoteAddedEventObject
>;

export type VoteAddedEventFilter = TypedEventFilter<VoteAddedEvent>;

export interface SemaphoreVotingInternal extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SemaphoreVotingInternalInterface;

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

  functions: {};

  callStatic: {};

  filters: {
    "NullifierHashAdded(uint256)"(
      nullifierHash?: null
    ): NullifierHashAddedEventFilter;
    NullifierHashAdded(nullifierHash?: null): NullifierHashAddedEventFilter;

    "PollCreated(uint256,address)"(
      pollId?: null,
      coordinator?: PromiseOrValue<string> | null
    ): PollCreatedEventFilter;
    PollCreated(
      pollId?: null,
      coordinator?: PromiseOrValue<string> | null
    ): PollCreatedEventFilter;

    "PollEnded(uint256,address,uint256)"(
      pollId?: null,
      coordinator?: PromiseOrValue<string> | null,
      decryptionKey?: null
    ): PollEndedEventFilter;
    PollEnded(
      pollId?: null,
      coordinator?: PromiseOrValue<string> | null,
      decryptionKey?: null
    ): PollEndedEventFilter;

    "PollStarted(uint256,address,uint256)"(
      pollId?: null,
      coordinator?: PromiseOrValue<string> | null,
      encryptionKey?: null
    ): PollStartedEventFilter;
    PollStarted(
      pollId?: null,
      coordinator?: PromiseOrValue<string> | null,
      encryptionKey?: null
    ): PollStartedEventFilter;

    "ProofVerified(uint256,bytes32)"(
      groupId?: PromiseOrValue<BigNumberish> | null,
      signal?: null
    ): ProofVerifiedEventFilter;
    ProofVerified(
      groupId?: PromiseOrValue<BigNumberish> | null,
      signal?: null
    ): ProofVerifiedEventFilter;

    "VoteAdded(uint256,bytes32)"(
      pollId?: PromiseOrValue<BigNumberish> | null,
      vote?: null
    ): VoteAddedEventFilter;
    VoteAdded(
      pollId?: PromiseOrValue<BigNumberish> | null,
      vote?: null
    ): VoteAddedEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
