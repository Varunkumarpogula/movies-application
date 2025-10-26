import { UserButton, useUser } from "@clerk/clerk-react";

export function UserProfile() {
  const { user } = useUser();

  return (
    <div className="user-profile">
      {user && (
        <div className="user-info">
          <span>Welcome, {user.firstName || user.username}!</span>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      )}
    </div>
  );
}