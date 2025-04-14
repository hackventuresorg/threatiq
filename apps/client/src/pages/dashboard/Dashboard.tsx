import { login, UserDetails, userExists } from "@/queries/auth";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const checkAndSaveUser = async () => {
      if (isLoaded && isSignedIn && user) {
        const exists = await userExists(user.id);
        if (exists) {
          return;
        } else {
          const userInfo: UserDetails = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            fullName: `${user.firstName} ${user.lastName}`,
          };
          login(userInfo);
        }
      }
    };

    checkAndSaveUser();
  }, []);

  return <div>Dashboard</div>;
}
