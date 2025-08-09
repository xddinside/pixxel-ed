'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Doc } from '@/convex/_generated/dataModel';

export default function FindMentorPage() {
  const mentors = useQuery(api.users.getApprovedMentors);

  if (mentors === undefined) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>Loading mentors...</p>
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
            {mentors.map((mentor: Doc<"users">) => (
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
                  <Button className="w-full">Connect</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
