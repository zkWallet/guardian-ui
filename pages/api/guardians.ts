import type { NextApiRequest, NextApiResponse } from "next";
import "dotenv/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);

  try {
    const body = {
      username: process.env.DAPP_USERNAME as string,
      password: process.env.DAPP_PASSWORD as string,
    };
    const url = `${process.env.GUARDIAN_SERVICE}${process.env.AUTH_LOGIN_URI}`;
    // get token
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const token = await response.json();

    let data: any = {};
    if (token.access_token) {
      const access_token: any = token.access_token;
      const GUARDIAN_URL = `${process.env.GUARDIAN_SERVICE}${process.env.GUARDIANS_URI}`;

      const postGuardians = await fetch(GUARDIAN_URL, {
        body: JSON.stringify(req.body),
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        }),
      });
      data = await postGuardians.json();
      res.status(200).json(data);
    }
  } catch (error: any) {
    console.log("error ===>", error);
    const { message } = JSON.parse(error.body).error;
    const reason = message.substring(
      message.indexOf(`'`) + 1,
      message.lastIndexOf(`'`)
    );

    res.status(500).send(reason || "Unknown error!");
  }
}
