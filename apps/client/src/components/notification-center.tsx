import { Inbox } from "@novu/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
export function NotificationCenter() {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <div>
      {user && (
        <Inbox
          applicationIdentifier={import.meta.env.VITE_NOVU_APPLICATION_IDENTIFER}
          subscriberId={user.id}
          routerPush={(path: string) => navigate(path)}
        />
      )}
    </div>
  );
}
