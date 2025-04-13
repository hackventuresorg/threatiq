import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm">
      <div className="container px-4 sm:px-6 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a
            className="flex items-center space-x-3 font-bold text-primary p-1.5 rounded-md hover:bg-primary/5 transition-colors"
            href="/"
          >
            <Shield className="h-6 w-6" />
            <span className="text-lg tracking-tight">ThreatIQ</span>
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <SignInButton mode="modal">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground px-4"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="shadow-sm px-4">
              Sign Up
            </Button>
          </SignUpButton>
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
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="w-full justify-start px-4 py-2.5">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="w-full justify-start shadow-sm px-4 py-2.5">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </div>
    </nav>
  );
}
