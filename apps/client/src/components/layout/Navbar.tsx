import { Button } from "@/components/ui/button";
import { SignedIn, SignOutButton, useUser } from "@clerk/clerk-react";
import { Menu, Shield, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "../notification-center";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm">
      <div className="px-4 sm:px-6 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a
            className="flex items-center space-x-3 font-bold text-primary p-1.5 rounded-md hover:bg-primary/5 transition-colors"
            href="/"
          >
            <Shield className="h-6 w-6" />
            <span className="text-lg tracking-tight">ThreatIQ</span>
          </a>
          {isLoaded && isSignedIn && (
            <div className="flex items-center space-x-3">
              <Button variant="link" size="sm" onClick={() => navigate("/dashboard")}>
                <span className="text-sm font-medium">Dashboard</span>
              </Button>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <SignedIn>
          <NotificationCenter />
          </SignedIn>
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="h-8 w-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm font-medium">{user?.firstName || "User"}</span>
              </div>
              <SignOutButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground px-4"
                >
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground px-4"
              onClick={handleSignIn}
            >
              Sign In / Sign Up
            </Button>
          )}
        </div>

        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-md hover:bg-primary/5"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border/40",
          mobileMenuOpen ? "max-h-40" : "max-h-0"
        )}
      >
        <div className="container px-4 sm:px-6 md:px-8 py-4 flex flex-col space-y-3">
          {isLoaded && isSignedIn ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                {user?.imageUrl ? (
                  <Avatar>
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm font-medium">{user?.firstName || "User"}</span>
              </div>
              <SignOutButton>
                <Button variant="ghost" size="sm" className="w-full justify-start px-4 py-2.5">
                  Sign Out
                </Button>
              </SignOutButton>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-4 py-2.5"
              onClick={handleSignIn}
            >
              Sign In / Sign Up
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
