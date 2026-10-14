import { listEvents } from "@/lib/events";
import { handle } from "@/lib/http";
export const GET = handle((request) => listEvents(request, true));
