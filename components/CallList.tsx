//6.0
"use client"

import { useGetCalls } from '@/hooks/useGetCall'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from './ui/use-toast';


//6.1:we will work on fecting the calls by creating a custom hook
const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  //6.2:we will call the useGetCall hook so that we can reuse it
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();
  //6.4:we will create a new state statement for the recordings
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const { toast } = useToast()

  //6.3:we have to figure out where we are based on the url parameter thatwe are in,if its  upcoming or recording....
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  }

  //6.5:set the No call message if they is no call
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No Recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  }

  //8.1:a use effect function to fetch the recordings
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        //get the access to actual meeting that a member was in
        const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()))
  
        //extract the recordings
        const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings);
  
        setRecordings(recordings);
        
      } catch (error) {
        toast({ title: "Try again later" })
      }
    }

    //we call it if only type is equal to recordings
    if(type === "recordings") fetchRecordings();
  }, [type, callRecordings, toast]);
  
  
  //6.6:
  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  
  if(isLoading) return <Loader />

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
        <MeetingCard 
        key={(meeting as Call).id}
        icon={
          type === "ended"
            ? "/icons/previous.svg"
            : type === "upcoming"
            ? "/icons/upcoming.svg"
            : "/icons/recordings.svg"
        }
        title={
          (meeting as Call).state?.custom?.description ||
          (meeting as CallRecording).filename?.substring(0, 20) ||
          'Personal Meeting'
        }
        date={
          (meeting as Call).state?.startsAt?.toLocaleString() ||
          (meeting as CallRecording).start_time?.toLocaleString()
        }
        isPreviousMeeting={type === "ended"}
        link={
          type === 'recordings'
            ? (meeting as CallRecording).url
            : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
        }
        buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
        buttonText={type === "recordings" ? "Play" : "Start"}
        handleClick={
          type === 'recordings'
            ? () => router.push(`${(meeting as CallRecording).url}`)
            : () => router.push(`/meeting/${(meeting as Call).id}`)
        }
        />
      )) : (
        <h1>{noCallsMessage}</h1>
      )}

    </div>
  )
}

export default CallList