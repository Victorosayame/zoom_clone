"use client"

import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
  //3.0:useState for mic and camera
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);

  //3.2:we wnat to access the call,which has access to mic and camera
  const call = useCall();

  if(!call) {
    throw new Error("usecall must be used within StreamCall component")
  }

  //3.1:
  useEffect(() => {
    //3.3:if mic and cam is turned on,disable it else enable it
    if(isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  },[isMicCamToggledOn, call?.camera, call?.microphone])
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <VideoPreview />
      <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input
            type='checkbox'
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button className='rounded-md bg-green-500 px-4 py-2.5' onClick={() => {
        call.join();

        //3.5: we can then call setIsSteUpComplete and set it to true
        setIsSetupComplete(true);
      }}>Join meeting</Button>
    </div>
  )
}

export default MeetingSetup