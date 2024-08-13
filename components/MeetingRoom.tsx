"use client";

//4.0

import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

//define a type for the call layout
type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {

  
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");

  //to show participant
  const [showParticipants, setShowParticipants] = useState(false);

  const router = useRouter();

  //to dispaly call layout when on a video call
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  //function to end calls for all users if its a personal room,we will do this using params
  const searchParams = useSearchParams();
  //if we do have access to the personal,then we want it to be true else we want it do be false,we do this conversion by using !!
  const isPersonalRoom = !!searchParams.get("personal")

  //get access to the usecall calling state to show a loader while waiting to join call
  const { useCallCallingState } = useCallStateHooks();
  //we get access to the calling state
  const callingState = useCallCallingState();

  if(callingState !== CallingState.JOINED) return <Loader />

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap mb-5">
        <CallControls onLeave={() => router.push("/")}/>

        <DropdownMenu>
          <div className="flex items-center">
           <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white"/>
           </DropdownMenuTrigger>

          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "speaker-left", "speaker-right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem className="cursor-pointer" onClick={() => {setLayout(item.toLowerCase() as CallLayoutType)}}>
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1"/>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            {/* button from lucid react to show all active participant */}
            <User size={20} className="text-white"/>
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}

      </div>
    </section>
  );
};

export default MeetingRoom;
