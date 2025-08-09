'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { Doc, Id } from '@/convex/_generated/dataModel';

const formatSubject = (subject: string) => {
  return subject
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function AdminDashboard() {
  const pendingMentors = useQuery(api.users.getPendingMentors);
  const approveMentor = useMutation(api.users.approveMentor);
  const rejectMentor = useMutation(api.users.rejectMentor);
  const [selectedMentor, setSelectedMentor] = useState<Doc<'users'> | null>(null);

  const handleAction = async (action: 'approve' | 'reject', userId: Id<'users'>) => {
    try {
      if (action === 'approve') {
        await approveMentor({ userId });
        toast.success('Mentor approved!');
      } else {
        await rejectMentor({ userId });
        toast.success('Mentor rejected.');
      }
    } catch (error) {
      toast.error('Action failed', {
        description: String(error),
      });
    }
  };

  if (pendingMentors === undefined) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Pending Mentor Applications
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Review and manage new mentor applications.
        </p>
      </div>

      {pendingMentors.length === 0 ? (
        <p className="text-center text-muted-foreground">No pending applications.</p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingMentors.map((mentor) => (
              <Card
                key={mentor._id}
                className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{mentor.name}</CardTitle>
                  <CardDescription className="text-base pt-1">
                    {mentor.applicationDetails?.university} - Year {mentor.applicationDetails?.yearOfStudy}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {mentor.applicationDetails?.subjects?.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {formatSubject(subject)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedMentor(mentor)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    {selectedMentor?._id === mentor._id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{selectedMentor.name}'s Application</DialogTitle>
                          <DialogDescription>
                            {selectedMentor.applicationDetails?.university} - Year {selectedMentor.applicationDetails?.yearOfStudy}
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <h4 className="font-semibold mt-4">Subjects and Grades:</h4>
                          <ul className="list-disc list-inside space-y-1 mt-2">
                            {selectedMentor.applicationDetails?.subjects?.map((subject, index) => (
                              <li key={index}>
                                <strong>{formatSubject(subject)}:</strong> {selectedMentor.applicationDetails?.grades?.[index] || 'N/A'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAction('approve', mentor._id)}>Approve</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAction('reject', mentor._id)}
                    >
                      Reject
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
