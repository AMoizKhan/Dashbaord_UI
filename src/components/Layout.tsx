import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Receipt, Plus, Settings, FileText, Home } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Create Invoice", href: "/create", icon: Plus },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground">
                  InvoiceFlow
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link key={item.name} to={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "flex items-center space-x-2",
                          isActive && "bg-secondary text-secondary-foreground",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full flex items-center space-x-2 justify-start",
                        isActive && "bg-secondary text-secondary-foreground",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
