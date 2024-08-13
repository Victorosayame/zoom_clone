import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

//createroutematcher will enable us to match specific route which we want to make public or private

//we will declear our protected route
const protectedRoutes = createRouteMatcher([
  "/",
  "/upcoming",
  "/previous",
  "/recordings",
  "/personal-room",
  "/meeting(.*)"
])

// then create a callback function inside the clerk middleware
export default clerkMiddleware((auth, req) => {
  if(protectedRoutes(req)) auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};