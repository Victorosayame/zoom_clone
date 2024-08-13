import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react"

//2.3:a hook is basically a function starting with the word use
export const useGetCallById = (id: string | string[]) => {
  //the usestate function we be of a type Call
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  //we can get access to our stream video client
  const client = useStreamVideoClient();

  //useEffect so that we can start fetching our currently active call
  useEffect(() => {
    //we will check if the caller exist
    if(!client) return;

    const loadCall = async () => {
      //query all of the existing call by a filter
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id
        }
      })

      if(calls.length > 0) setCall(calls[0]);

      setIsCallLoading(false)
    }

    loadCall();
    {/* we declared a function and called it because the function is an async function and we cannot write regular async await code within a useEffect unless we declare it as a new function */}
  }, [client, id]) //we will recall our useeffect when ever the client changes or when the id changes

  return { call, isCallLoading };
}