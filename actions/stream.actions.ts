"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

//1.2:define api key straight from env variables
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
//add the secret in the actions because we dont want the secret key to be public
const apiSecret = process.env.STREAM_SECRET_KEY;

//1.8:we will create our token provider
export const tokenProvider = async () => {
  //we have to get the user from clerk
  const user = await currentUser();

  if(!user) throw new Error("User is not logged in");
  if(!apiKey) throw new Error("No APi key");
  if(!apiSecret) throw new Error("No APi secret");

  //then we create the stream client coming from the node sdk because we are on the server side
  const client = new StreamClient(apiKey, apiSecret)

  //token valid for one hour
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  //we have to figure out when the token was issued
  const issued = Math.floor(Date.now() / 1000) - 60;
  //then we can create a new token
  const token = client.createToken(user.id, exp, issued)

  return token;
}
