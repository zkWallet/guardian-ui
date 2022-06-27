import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore, SemaphoreFullProof, SemaphoreSolidityProof } from "@zk-kit/protocols"
import { providers, Contract, constants, utils, BigNumber } from "ethers"
import type { NextPage } from 'next'
import Head from "next/head"
import React, { useState } from "react"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AppBar, Button, Typography, Toolbar, Link } from "@mui/material";
import styles from "../styles/Home.module.css"
// import TextBox from "./component/TextBox"; 
import GuardianFacetAbi from "../contracts/facets/GuardianFacet.sol/GuardianFacet.json";
import RecoveryFacetAbi from "../contracts/facets/RecoveryFacet.sol/RecoveryFacet.json";
import { GuardianFacet, RecoveryFacet } from "../typechain-types"


type UserInput = {
    walletAddress: string
    newOwnerAddress: string,
    greet: string
  }

const Home: NextPage = () => {
    const [logs, setLogs] = React.useState("Connect your wallet to recover!")

    // useEffect(() => {
    //     const newGreeting = async () => {
    //       const provider = (await detectEthereumProvider()) as any;
    //       const ethersProvider = new providers.Web3Provider(provider);
    
    //       const contract = new Contract(
    //         "0xf4AE7E15B1012edceD8103510eeB560a9343AFd3",
    //         Greeter.abi,
    //         ethersProvider
    //       );
    
    //       contract.on("NewGreeting", (greeting: string) => {
    //         setGreetingEvents(prevState => [...prevState, utils.parseBytes32String(greeting)]);
    //       });
    //     };
    
    //     newGreeting().catch(console.error);
    // }, []);
    

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
            walletAddress: "0x64C2Fbc31afE74BAEcAe92Bb28D33bce6B454C0B",
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

            let identityCommitments: string[] = [];
            let identityCommitmentsBigInt: BigInt[] = [];
            let merkleProof: any;
            let guardians: any[] = [];
            let version: string;

            const walletAddress = userInput.walletAddress
            const newOwnerAddress = userInput.newOwnerAddress
            const contract: any | GuardianFacet = new Contract(
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
                                    const recoveryInstance: any | RecoveryFacet = new Contract(
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
            <Head>
                <title>Greetings</title>
                <meta name="description" content="dApp zkWallet guardian recovery." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Guardian Recovery</h1>

                <p className={styles.description}>dApp zkWallet guardian recovery.</p>

                <div className={styles.logs}>{logs}</div>

                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="form-group">
                        <input  type="text"
                                placeholder="User wallet address"
                                id="walletAddress"
                                {...register("walletAddress")} 
                                className={`form-control ${errors.walletAddress ? 'is-invalid' : ''}`}
                        />
                        <div className={styles.invalid}>{errors.name?.message}</div>
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
                    <div className={styles.invalid}>{errors.name?.message}</div>
                    <div className={styles.invalid}>{errors.address?.message}</div>
                    <div className={styles.invalid}>{errors.age?.message}</div>
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
                <div style={{ marginTop: "5em" }}>
                    <div className={styles.logs}>Others Onchain data:</div>
                    {/* {greetingEvents.map((greetingEvents) => {
                        return <TextBox value={greetingEvents} />
                    })} */}
                    {/* <TextBox value={greetingEvents} /> */}
                </div>
            </main>
        </div>
    )
}

export default Home
