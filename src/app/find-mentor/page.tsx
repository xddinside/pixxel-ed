'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

export default function FindMentorPage() {
  const mentors = useQuery(api.users.getApprovedMentors);
  const currentUser = useQuery(api.users.getCurrentUser);
  const connectToMentor = useMutation(api.users.connectToMentor);

  // This local state is still useful for immediate UI updates.
  const [connectedMentors, setConnectedMentors] = useState<Id<"users">[]>([]);

  useEffect(() => {
    if (currentUser?.mentorIds) {
      setConnectedMentors(currentUser.mentorIds);
    }
  }, [currentUser]);

  const handleConnect = async (mentorId: Id<"users">) => {
    try {
      await connectToMentor({ mentorId });

      setConnectedMentors((prev) => [...prev, mentorId]);
      toast.success("You've connected with the mentor!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect.", { 
        description: error instanceof Error ? error.message : "An unknown error occurred." 
      });
    }
  };

  if (mentors === undefined || currentUser === undefined) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Find Your Mentor</h1>
        <p className="mt-4 text-lg text-muted-foreground">Browse our list of expert mentors and find the perfect match for you.</p>
      </div>
      {mentors.length === 0 ? (
        <p className="text-center text-muted-foreground">No mentors are available at the moment. Please check back later.</p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor: Doc<"users">) => {
              const isConnected = connectedMentors.includes(mentor._id);

              return (
                <Card key={mentor._id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{mentor.name}</CardTitle>
                    <CardDescription>{mentor.applicationDetails?.university}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">{mentor.bio || "No bio available."}</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.subjects?.map((subject, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button 
                      className="w-full"
                      onClick={() => !isConnected && handleConnect(mentor._id)}
                      disabled={isConnected}
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
    </div>
  );
}
