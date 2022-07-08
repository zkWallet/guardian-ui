import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore, SemaphoreFullProof, SemaphoreSolidityProof } from "@zk-kit/protocols"
import { providers, Contract, constants, utils, BigNumber } from "ethers"
import type { NextPage } from 'next'
import Image from 'next/image'
import React, { useState, useEffect } from "react"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, Link } from "@mui/material"
import styles from "../styles/Home.module.css"
import GuardianFacetAbi from "../contracts/facets/GuardianFacet.sol/GuardianFacet.json"
import RecoveryFacetAbi from "../contracts/facets/RecoveryFacet.sol/RecoveryFacet.json"


type UserInput = {
    walletAddress: string
    newOwnerAddress: string,
    greet: string
}

const Home: NextPage = () => {
    const [logs, setLogs] = React.useState("Connect your wallet to recover!")
    const [greeting, setGreeting] = useState<string>()
    const [connection, setConnection] = useState("")
    const [provider, setProvider] = useState<any>()
    const [signer, setSigner] = useState<providers.JsonRpcSigner>()
    const [signerAddress, setSignerAddress] = useState<string>("")

    useEffect(() => {
      const fetchProvider = async () => {
        const provider =  (await detectEthereumProvider()) as any
        setProvider(provider)

        if (provider.chainId === '0x635ae020') {
          setConnection('You are connected to  Harmony Devnet.')
        } else if (provider.chainId === '0x89') {
          setConnection('You are connected to  Polygon Mainnet.')
        } else if (provider.chainId === '0xa') {
          setConnection('You are connected to  Optimism Mainnet.')
        } else if (provider.chainId === '0x440') {
          setConnection('You are connected to Metis Mainnet.')
        }  else if (provider.chainId === '0x120') {
          setConnection('You are connected to Boba Mainnet.')
        } else {
          setConnection('Please connect to Polygon-, Optimism-, Mentis-, Boba mainnet or Harmony Devnet!')
        }

        await provider.request({ method: "eth_requestAccounts" })
        
        const ethersProvider = new providers.Web3Provider(provider)
        const signerData = ethersProvider.getSigner()
        setSigner(signerData)
        const newSignerAddress: string = await signerData.getAddress() as string
        setSignerAddress(newSignerAddress)
        console.log('signerAddress: ', signerAddress)
      }
      
      // call the function
      fetchProvider()
        // make sure to catch any error
        .catch(console.error)

    
      }, [signer])

    // form validation rules 
    const validationSchema = Yup.object().shape({
      walletAddress: Yup.string()
      .required("Wallet address is required"),
      newOwnerAddress: Yup.string()
      .required("New owner address is required"), 
      greet: Yup.string()
          .required('Greeting is required')  
          .max(32, 'Greeting must be less than 32 characters')
    })

    const formOptions = { 
      resolver: yupResolver(validationSchema),
      defaultValues: {
          greet: "Hello World!",
      }
    }
    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm<UserInput>(formOptions)
    const { errors } = formState


    const onSubmitHandler = (userInput: UserInput) => {
        recover(userInput)
    }


    async function recover(userInput: UserInput) {
      setLogs("Creating your Semaphore identity...")

      const groupId: BigNumber = constants.One

      let fullProof: SemaphoreFullProof
      let solidityProof: SemaphoreSolidityProof

      const message = await signer.signMessage("Sign this message to create your identity!")

      const identity = new ZkIdentity(Strategy.MESSAGE, message)
      const identityCommitment = identity.genIdentityCommitment()

      console.log("identityCommitment: ", identityCommitment)

      let identityCommitments: string[] = []
      let identityCommitmentsBigInt: BigInt[] = []
      let merkleProof: any
      let guardians: any[] = []
      let version: string

      const walletAddress = userInput.walletAddress
      const newOwnerAddress = userInput.newOwnerAddress
      const contract: any  = new Contract(
          walletAddress.toString(),
          GuardianFacetAbi.abi,
          signer
      )
  
      //check if contract is callable
      try {
        version = await contract.guardianFacetVersion()
        console.log("guardianFacetVersion: ", version)
        if (version === "0.1.0.alpha") {
          setLogs("Your Semaphore identity is being created...")

          try {
              guardians = await contract.getGuardians(1)
              console.log("guardians", guardians)
              if (guardians.length > 0) {           
                for (let i = 0; i < guardians.length; i++) {
                identityCommitments.push((guardians[i].hashId).toString())
                identityCommitmentsBigInt.push(BigInt(guardians[i].hashId))
                }

                console.log(identityCommitments)
                console.log("identityCommitmentsBigInt", identityCommitmentsBigInt)

                try {
                  merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)

                  console.log("merkleProof", merkleProof)

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
                  const recoveryInstance: any = new Contract(
                    walletAddress.toString(),
                    RecoveryFacetAbi.abi,
                    signer
                  )
                  
                  try {                    
                    const tx = await recoveryInstance.recover(
                        groupId,
                        utils.formatBytes32String(greeting),
                        fullProof.publicSignals.nullifierHash,
                        fullProof.publicSignals.externalNullifier,
                        solidityProof,
                        newOwnerAddress,
                    )

                    const receipt = await tx.wait()
                    console.log(receipt)
                    setLogs("Recovery successful!")
                  } catch (recoverError) {
                      setLogs("Error occured while recovering the wallet!")
                      console.log("recoverError", recoverError)
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
    }

    if (!provider) {
        return <div>Looding..</div>
    } else {
      console.log(connection)
    }

    return (
        <div className={styles.container}>

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
            </main>
            <footer className={styles.footer}>
                <Link color="#FFFFFF"
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </Link>
                <Link color="#FFFFFF" href="https://github.com/zkWallet/zkWallet-docs">Github documentation</Link>
            </footer>
        </div>
    )
}

export default Home
