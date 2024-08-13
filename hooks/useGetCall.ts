import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

//6.1
export const useGetCalls = () => {
  //we will figure out how we can load those calls
  const [calls, setCalls] = useState<Call[]>([]);
  //to help us keep track of the loading state
  const [isLoading, setIsLoading] = useState(false);


  const client = useStreamVideoClient();

  //we want to fetch calls for a specific user
  const { user } = useUser();

  useEffect(() => {
    const loadCalls = async () => {
      if(!client || !user?.id) return;

      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          //we are sorting them by when they start not created
          sort: [{ field: "starts_at", direction: -1 }],
          //then we will filter them
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              //we want to show the call if we are the one that created it
              { created_by_user_id: user.id },
              //or if we are a member of the call
              { members: { $in: [user.id] } },
            ]
          }
        });

        setCalls(calls);
      } catch (error) {
        console.log(error)
      } finally {
        //to stop the loading after fetching the call if it goes right or wrong it should stop here
        setIsLoading(false)
      }
    }

    loadCalls();

  }, [client, user?.id])//we will listen to the changes in the client and the user because we have to have both to properly fetch the meetings for that user


  //figure out the logic for knowing how to filter the endedCalls and Upcoming calls
  //first we have to get access to the now time
  const now = new Date();
  //we want to make this hook reusable,what we can do is return the calls by filtering them
  const endedCalls = calls.filter(({ state: { startsAt, endedAt }}: Call) => {
    return(startsAt && new Date(startsAt) < now || !!endedAt)
  })
  const upcomingCalls = calls.filter(({ state: { startsAt }}: Call) => {
    return startsAt && new Date(startsAt) > now
  })
  

  return {
    endedCalls,
    upcomingCalls,
    //for recording we pass the call because we are going to do a filtering later on
    callRecordings: calls,
    isLoading,
  }
}