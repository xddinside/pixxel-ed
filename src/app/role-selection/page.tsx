'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, UserPlus } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { useState } from 'react';

export default function RoleSelectionPage() {
  const router = useRouter();
  const updateUserRole = useMutation(api.users.updateUserRole);
  const [isLoading, setIsLoading] = useState<null | 'student' | 'mentor'>(null);

  const handleRoleSelection = async (role: 'student' | 'mentor') => {
    setIsLoading(role);
    try {
      await updateUserRole({ role });
      toast.success(`You have selected the ${role} role!`);
      if (role === 'mentor') {
        router.push('/become-mentor');
      } else {
        router.push('/find-mentor');
      }
    } catch (error) {
      toast.error("Failed to update role.", {
        description: String(error),
      });
    } finally {
        setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Welcome to PixxelEd!</h1>
        <p className="mt-4 text-lg text-muted-foreground">How would you like to get started?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="items-center text-center">
            <School className="size-12 text-blue-500 mb-4" />
            <CardTitle className="text-2xl font-semibold">Join as a Student</CardTitle>
            <CardDescription className="text-md">
              Find the perfect mentor to guide you on your learning journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => handleRoleSelection('student')}
              className="w-full max-w-xs"
              disabled={isLoading !== null}
            >
              {isLoading === 'student' ? 'Selecting...' : 'Find a Mentor'}
            </Button>
          </CardContent>
        </Card>

        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="items-center text-center">
            <UserPlus className="size-12 text-blue-500 mb-4" />
            <CardTitle className="text-2xl font-semibold">Join as a Mentor</CardTitle>
            <CardDescription className="text-md">
              Share your knowledge and inspire the next generation of learners.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => handleRoleSelection('mentor')}
              className="w-full max-w-xs"
              disabled={isLoading !== null}
            >
              {isLoading === 'mentor' ? 'Selecting...' : 'Become a Mentor'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
