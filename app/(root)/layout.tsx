import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video calling app",
  icons: {
    icon: "/icons/logo.svg"
  }
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      {/*we will wrap our root layout with the streamvideoprovider we just created */}
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
