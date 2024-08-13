"use client"

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
  //we want to get access to the information about the call
  const call = useCall();
  const router = useRouter();

  const { useLocalParticipant } = useCallStateHooks();
  //we can get access into the localparticipant
  const localParticipant = useLocalParticipant();
  //we can check if we are the meeting owner
  const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;

  if(!isMeetingOwner) return null;

  //
  return (
    <Button onClick={async () => {
      await call.endCall();
      router.push("/")
    }} className='bg-red-500'>End call for everyone</Button>
  )
}

export default EndCallButton