import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore, SemaphoreFullProof, SemaphoreSolidityProof } from "@zk-kit/protocols"
import { providers, Contract, constants, utils, BigNumber } from "ethers"
import type { NextPage } from 'next'
import Image from 'next/image'
// import Head from "next/head"
import React, { useState } from "react"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AppBar, Button, Typography, Toolbar, Link } from "@mui/material";
import styles from "../styles/Home.module.css"
// import TextBox from "./component/TextBox"; 
import GuardianFacetAbi from "../contracts/facets/GuardianFacet.sol/GuardianFacet.json";
import RecoveryFacetAbi from "../contracts/facets/RecoveryFacet.sol/RecoveryFacet.json";
// import { GuardianFacet, RecoveryFacet } from "../typechain-types"


type UserInput = {
    walletAddress: string
    newOwnerAddress: string,
    greet: string
}

const Home: NextPage = () => {
    const [logs, setLogs] = React.useState("Connect your wallet to recover!")
    const [event, setEvents] = useState<string>()
    const [greeting, setGreeting] = useState<string>()

    // form validation rules 
    const validationSchema = Yup.object().shape({
        walletAddress: Yup.string()
        .required("Wallet address is required"),
        newOwnerAddress: Yup.string()
        .required("New owner address is required"), 
        greet: Yup.string()
            .required('Greeting is required')  
            .max(32, 'Greeting must be less than 32 characters')
    });

    const formOptions = { 
        resolver: yupResolver(validationSchema),
        defaultValues: {
            greet: "Hello World!",
        }
    };
    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm<UserInput>(formOptions)
    const { errors } = formState;


    const onSubmitHandler = (userInput: UserInput) => {
        recover(userInput)
    }


    async function recover(userInput: UserInput) {
        setLogs("Creating your Semaphore identity...")

        const provider = (await detectEthereumProvider()) as any

        if (provider.chainId === "0x635ae020") {
            setLogs("You are connected to  Harmony One Devnet...")

            const groupId: BigNumber = constants.One;

            let fullProof: SemaphoreFullProof;
            let solidityProof: SemaphoreSolidityProof;

            await provider.request({ method: "eth_requestAccounts" })

            const ethersProvider = new providers.Web3Provider(provider)
            const signer = ethersProvider.getSigner()
            const message = await signer.signMessage("Sign this message to create your identity!")

            const identity = new ZkIdentity(Strategy.MESSAGE, message)
            const identityCommitment = identity.genIdentityCommitment()

            console.log("identityCommitment: ", identityCommitment)

            console.log(event)
            console.log(greeting)

            let identityCommitments: string[] = [];
            let identityCommitmentsBigInt: BigInt[] = [];
            let merkleProof: any;
            let guardians: any[] = [];
            let version: string;

            const walletAddress = userInput.walletAddress
            const newOwnerAddress = userInput.newOwnerAddress
            const contract: any  = new Contract(
                walletAddress.toString(),
                GuardianFacetAbi.abi,
                signer
            );
        
            //check if contract is callable
            try {
                version = await contract.guardianFacetVersion()
                console.log("guardianFacetVersion: ", version)
                if (version === "0.0.1") {
                    setLogs("Your Semaphore identity is being created...")
    
                    try {
                        guardians = await contract.getGuardians(1);
                        console.log("guardians", guardians);
                        if (guardians.length > 0) {           
                            for (let i = 0; i < guardians.length; i++) {
                            identityCommitments.push((guardians[i].hashId).toString());
                            identityCommitmentsBigInt.push(BigInt(guardians[i].hashId));
                            }
    
                            console.log(identityCommitments);
                            console.log("identityCommitmentsBigInt", identityCommitmentsBigInt);
    
                            try {
                                merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)
    
                                console.log("merkleProof", merkleProof);
    
                                setLogs("Creating your Semaphore proof...")
    
                                const greeting = userInput.greet
                                setGreeting(greeting)
    
                                const witness = Semaphore.genWitness(
                                    identity.getTrapdoor(),
                                    identity.getNullifier(),
                                    merkleProof,
                                    merkleProof.root,
                                    greeting
                                )
    
                                fullProof = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey")
                                solidityProof = Semaphore.packToSolidityProof(fullProof.proof)
    
                                console.log(solidityProof)

                                try {
                                    const recoveryInstance: any = new Contract(
                                        walletAddress.toString(),
                                        RecoveryFacetAbi.abi,
                                        signer
                                    );

                                    const tx = await recoveryInstance.recover(
                                        groupId,
                                        utils.formatBytes32String(greeting),
                                        fullProof.publicSignals.nullifierHash,
                                        fullProof.publicSignals.externalNullifier,
                                        solidityProof,
                                        newOwnerAddress,
                                    )
 
                                    const receipt = await tx.wait();
                                    console.log(receipt);
                                    if (receipt.events.length > 0) {
                                        setEvents(JSON.stringify(receipt.events))
                                        console.log(receipt.events)
                                        const resultGreeting = receipt.events[0].args.greeting;
                                        setGreeting(resultGreeting);
                                        console.log(utils.parseBytes32String(resultGreeting));
                                    }
                                } catch (recoverError) {
                                    setLogs("Error occured while recovering the wallet!")
                                    console.log("recoverError", recoverError);
                                }
                            } catch (error) {
                                setLogs("You are not a guardian of this wallet!")
                                console.log("error", error)
                            }
                        } else {
                            setLogs(`No guardians available for User wallet: ${walletAddress}`)
                        }
                    } catch (guardianError) {
                        setLogs(`guardianError ${guardianError}`)
                    }
                } else {
                    setLogs(`User wallet: ${walletAddress}  is not callable`)
                }
            } catch (contractError) {
                setLogs(`Non a GuardianFacet contract`)
                console.log("contractError", contractError)
            }
        }  else {
            setLogs("Please change your network to Harmony One Devnet...")
        }
    }

    return (
        <div className={styles.container}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4" className={styles.logo}>
                    Navbar
                    </Typography>
                    <div className={styles.navlinks}>
                        <Link href="/">home</Link>
                        <Link href="/registration">Registration</Link>
                        
                    </div>
                </Toolbar>
            </AppBar>


            <main className={styles.main}>
                <h1 className={styles.title}>Guardian Recovery</h1>

                <p className={styles.description}>dApp zkWallet guardian recovery.</p>

                <div className={styles.logs}>{logs}</div>

                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="form-group">
                        <input  type="text"
                                placeholder="User wallet address to recover"
                                id="walletAddress"
                                {...register("walletAddress")} 
                                className={`form-control ${errors.walletAddress ? 'is-invalid' : ''}`}
                        />
                        <div className={styles.invalid}>{errors.walletAddress?.message}</div>
                    </div>
                    <input  type="text"
                            placeholder="New owner address"
                            id="newOwnerAddress"
                            {...register("newOwnerAddress")} 
                            className={`form-control ${errors.newOwnerAddress ? 'is-invalid' : ''}`}
                    />
                    <input  type="text"
                            placeholder="Your Greet"
                            id="inputGreet"
                            {...register("greet")}
                            color="primary"
                            className={`form-control ${errors.greet ? 'is-invalid' : ''}`}
                    />
                    <div className={styles.invalid}>{errors.walletAddress?.message}</div>
                    <div className={styles.invalid}>{errors.newOwnerAddress?.message}</div>
                    <div className={styles.invalid}>{errors.greet?.message}</div>
                    <div className="form-group">
                        <Button variant="contained" className={styles.button} type="submit" >Sign Identity</Button>
                        <Button variant="contained" className={styles.button} type="button" onClick={() => reset()} >Reset Form</Button>
                    </div>
                </form>
                <div style={{ marginTop: "5em" }}>
                    <div className={styles.logs}>Your Onchain data:</div>
                    {/* <TextBox value={greeting} /> */}
                </div>
            </main>
            <footer className={styles.footer}>
                <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                >
                Powered by{' '}
                <span className={styles.logo}>
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                </span>
                </a>
                <Link href="https://github.com/zkWallet/zkWallet-docs">Github documentation</Link>
            </footer>
        </div>
    )
}

export default Home
