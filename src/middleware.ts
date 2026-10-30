import { clerkMiddleware } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from "next/server";
const clerk = clerkMiddleware();
export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  if (
    !process.env.CLERK_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  )
    return NextResponse.next();
  return clerk(request, event);
}
export const config = {
  matcher: ["/mission-control(.*)", "/api/mission-control(.*)"],
};
