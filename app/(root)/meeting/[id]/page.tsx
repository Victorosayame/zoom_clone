"use client"

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useState } from 'react';


const Meeting = ({ params: { id } }: { params: { id: string }}) => {
  //2.0:we have to grab our currently authenticated user
  const { user, isLoaded } = useUser();
  
  //2.1:we want to know if the video and audio setup has been completed,which we will create a new usestate function for
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  //2.4:we will pass the id from the params into our custom hook
  const { call, isCallLoading } = useGetCallById(id);

  //2.5
  if(!isLoaded || isCallLoading) return <Loader />
  return (
    <main className='h-screen w-full'>
        {/* 2.2:we want to know within which call we are currently in,we can do that by assigning a special variable call in the streamCall component */}
        {/* 2.3:How do we get access to the call that we are currently within,we will develop a custom hook for that */}
      <StreamCall call={call}>
        <StreamTheme>
           {/*3.4:set the isSetUpComplete variable,pass it as a props in the meetingSetup */}
          {!isSetupComplete ? (

            <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
          ): (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting