import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { providers} from "ethers"
import type { NextPage } from "next"
import React from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

type GuardianInput = {
  registrationNumber: string,
  displayName: string,
  description: string,
  wallet?: string,
  address: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  email: string,
  phonenumber: number,
  website: string,
  identityCommitment?: string;
}

const Home: NextPage = () => {
  const [logs, setLogs] = React.useState("Connect your wallet and register!")

  // form validation rules 
  const validationSchema = Yup.object().shape({
    registrationNumber: Yup.string()
        .required("Registration number is required"),
    displayName: Yup.string()
      .required("Display name is required"),
    description: Yup.string()
      .required("Description is required"),
    address: Yup.string()
      .required("Address is required"),
    city: Yup.string()
      .required("City is required"),
    state: Yup.string()
      .required("State is required"),
    zip: Yup.string()
      .required("Zip is required"),
    country: Yup.string()
      .required("Country is required"),
    email: Yup.string().email("Invalid emailadress")
      .required("Email is required"),
    phonenumber: Yup.number()
      .required("Phone number is required")
      .positive("Phone number must be a positive number"),
    website: Yup.string().url("Invalid website url")
      .required("Website is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema)};

  const { handleSubmit, register } = useForm<GuardianInput>(formOptions)
  // const { errors } = formState;

  const onSubmitHandler = (guardian: GuardianInput) => {
    greet(guardian)
  }

  async function greet(guardian: GuardianInput) {
    setLogs("Creating your Semaphore identity...")
  
    const provider = (await detectEthereumProvider()) as any

    await provider.request({ method: "eth_requestAccounts" })

    const ethersProvider = new providers.Web3Provider(provider)
    const signer = ethersProvider.getSigner()
    const wallet = (await (signer.getAddress())).toString()
    const message = await signer.signMessage("Sign this message to create your identity!")
    const identity = new ZkIdentity(Strategy.MESSAGE, message)
    const identityCommitment = (identity.genIdentityCommitment()).toString()
    const registrationNumber = guardian.registrationNumber
    const displayName = guardian.displayName
    const description = guardian.description
    const address = guardian.address
    const city = guardian.city
    const state = guardian.state
    const zip = guardian.zip
    const country = guardian.country
    const email = guardian.email
    const phonenumber = (guardian.phonenumber).toString()
    const website = guardian.website
 
    guardian.wallet = (await wallet).toString()
    guardian.identityCommitment = identityCommitment.toString()

    const response = await fetch("http://localhost:3000/api/guardians", {
      method: "POST",
      body: JSON.stringify({
        registrationNumber,
        displayName,
        description,
        wallet,
        address,
        city,
        state,
        zip,
        country,
        email,
        phonenumber,
        website,
        identityCommitment
      }),
      headers: {
        "Content-Type": "application/json"
      },
    })
    if (response.status === 500) {
      const errorMessage = await response.text()

      setLogs(errorMessage)
    } else {
        const data = await response.json()
        console.log("data", data)
        setLogs("Registered as guardian!")
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
           <div>{logs}</div>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Guardian Registration
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="displayName"
                  {...register("displayName")} 
                  label="Company Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="registrationNumber"
                  {...register("registrationNumber")} 
                  label="Registration Number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  maxRows={4}
                  required
                  fullWidth
                  id="description"
                  {...register("description")} 
                  label="Company short description"
                  name="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phonenumber"
                  {...register("phonenumber")} 
                  label="Phone Number"
                  autoComplete="phonenumber"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  {...register("address")} 
                  label="address"
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="city"
                  required
                  fullWidth
                  id="city"
                  {...register("city")} 
                  label="City"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  {...register("state")} 
                  label="State/Province/Region"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="zip"
                  {...register("zip")} 
                  label="ZIP / Postal code"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  {...register("country")} 
                  label="Country"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  {...register("email")} 
                  label="Email Address"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Website https://"
                  type="website"
                  id="website"
                  {...register("website")} 
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Home
