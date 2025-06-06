import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleRedirect = () => navigate(user ? '/dashboard' : '/login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-zinc-950">
      <h1 className="text-red-400 text-4xl font-bold">Page Not Found!</h1>
      <Button
        variant="link"
        onClick={handleRedirect}
        className="underline underline-offset-4 text-xl font-semibold text-white hover:text-blue-400"
      >
        Go to {user ? "Dashboard" : "Login"} Page
      </Button>
    </div>
  );
};

export default NotFound;
