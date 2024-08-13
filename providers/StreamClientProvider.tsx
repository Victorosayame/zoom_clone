//first step to using stream to create our video call functionality
//1.0:
"use client"

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

//1.2:define api key straight from env variables
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;



 const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  //1.3:define our video client as a state
  //1.4:make it of a type StreamVideoClient
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  //1.6:we will create a new stream user directly from our currently logged in clerk user,add them as dependency variables
  const { user, isLoaded } = useUser();

  //1.5:we will properly set the VideoClient up using a useEffect so that typescript will not complain about the client
  useEffect(() => {
    if(!isLoaded || !user) return;
    if(!apiKey) throw new Error("Stream API key missing")

    //1.7:only if the user and api key is here,we can create a new video client
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      //1.8:token provider to verify user,created in the actions folder
      tokenProvider,
    })
    //1.9:after creating it we can set it to the state
    setVideoClient(client);
  }, [user, isLoaded]);

  //we will create a function for if the the video client is not there yet which will be a loader component
  if(!videoClient) return <Loader />
  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};

{/*we will wrap our root layout with the streamvideoprovider we just created */}

export default StreamVideoProvider