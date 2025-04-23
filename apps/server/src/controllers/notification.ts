import { Novu } from "@novu/api";
import { NOVU_SECRET_KEY, IN_APP_WORKFLOW_ID } from "../environments";

const novu = new Novu({
  secretKey: NOVU_SECRET_KEY,
});

type NotificationPayload = {
  notificationType: string;
  body: {
    risk: string;
    type: string;
    createdAt: string;
    cctvName: string;
  };
} & Record<string, any>;

export async function sendNotification(subscriberId: string, payload: NotificationPayload) {
  try {
    const response = await novu.trigger({
      workflowId: IN_APP_WORKFLOW_ID,
      to: { subscriberId },
      payload,
    });
    return response;
  } catch (error) {
    console.error("Novu notification error:", error);
    throw error;
  }
}
