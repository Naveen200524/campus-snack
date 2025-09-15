import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
      <div className="min-h-screen flex w-full bg-background">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
          <Button onClick={() => window.location.href = '/'} className="btn-hero">
            Return to Home
          </Button>
        </div>
      </div>
  );
};

export default NotFound;
