"use client"

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";


const MeetingTypeList = () => {
  const router = useRouter();
  
  const [meetingState, setMeetingState] = useState<"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined>();

  //we can now initiate a call since we have wrap our layout with streamvideoclientprovider
  //1.10:first we will check if a user exist
  const { user } = useUser();
  //1.11:we will initialize a stremavideoclient
  const client = useStreamVideoClient();
  //1.13:we set a state to create time for the meeting
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: ""
  })
  //1.14:once we create this call we want to set it to the state which we will create a new usestate function for,which is of a type call
  const [callDetails, setCallDetails] = useState<Call>();
  const { toast } = useToast()


  const createMeeting = async () => {
    //1.12
    if(!client || !user) return;

    try {
      if(!values.dateTime) {
        toast({
          title: "Please select a  date and time"
        })
        return;
      }
      //we have to generate a random id for the call
      const id = crypto.randomUUID();
      //we can create a call
      const call = client.call("default", id);

      if(!call) throw new Error("Failed to create a call")

      //1.13:we have to create a time that the meeting started
      const startsAt = values.dateTime.toISOString() ||
      new Date(Date.now()).toISOString();
      //we can get description of the meeting
      const description =  values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      //1.14:once we create this call we want to set it to the state which we will create a new usestate function for
      setCallDetails(call);

      //if no value.description
      if(!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({
        title: "Meeting Created"
      })
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting"
      })
    }
  }

  //5.1:get callmeetinglink
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard 
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard 
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      {/**10.0: we will work on the home page card to route to recordings when clicked and work on the join meetings card as well*/}
      <HomeCard 
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />
      <HomeCard 
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />
      {/*5.0 */}
      {!callDetails ? (
        <MeetingModal 
        isOpen={meetingState === "isScheduleMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
      >
        <div className="flex flex-col gap-2.5">
          <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
          <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => {
            setValues({...values, description: e.target.value})
          }}/>

        </div>
          {/*we also need to add a date and time picker,we will use the react date picker package install it and the types as well */}
          <div className="flex flex-col w-full gap-2.5">
          <label className="text-base text-normal leading-[22px] text-sky-2">Select Date and Time</label>
          <ReactDatePicker 
            selected={values.dateTime}
            onChange={(date) => setValues({...values, dateTime: date! })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full rounded bg-dark-3 p-2 focus:outline-none"
          />
          </div>
      </MeetingModal>
      ) : (
        <MeetingModal 
        isOpen={meetingState === "isScheduleMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Meeting Created"
        className="text-center"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({ title: "Link copied"})
        }}
        image="/icons/checked.svg"
        buttonIcon="/icons/copy.svg"
        buttonText="Copy Meeting Link"
      />
      )}
      {/*5.0 end */}




      <MeetingModal 
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      {/**10.1: we will work on the home page card to route to recordings when clicked and work on the join meetings card as well*/}

      <MeetingModal 
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting Link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList