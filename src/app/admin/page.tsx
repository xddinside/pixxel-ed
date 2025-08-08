'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const pendingMentors = useQuery(api.mentors.getPendingMentors);
  const approveMentor = useMutation(api.mentors.approveMentor);
  const rejectMentor = useMutation(api.mentors.rejectMentor);

  const handleAction = async (action: 'approve' | 'reject', userId: string) => {
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

  if (!pendingMentors) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-6">
      <h1 className="text-2xl font-semibold">Pending Mentor Applications</h1>
      {pendingMentors.length === 0 ? (
        <p className="text-muted-foreground">No pending applications.</p>
      ) : (
        pendingMentors.map((mentor) => (
          <Card key={mentor._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    University: {mentor.university} | Year: {mentor.yearOfStudy}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleAction('reject', mentor._id)}>
                    Reject
                  </Button>
                  <Button onClick={() => handleAction('approve', mentor._id)}>Approve</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
