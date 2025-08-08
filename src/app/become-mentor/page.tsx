'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function BecomeMentorPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [university, setUniversity] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const applyToBeMentor = useMutation(api.users.applyToBeMentor);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in to apply.</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const yearNum = parseInt(yearOfStudy, 10);
    if (isNaN(yearNum)) {
      toast.error('Please enter a valid year of study.');
      return;
    }
    try {
      await applyToBeMentor({ university, yearOfStudy: yearNum });
      toast.success('Application submitted!');
      setUniversity('');
      setYearOfStudy('');
    } catch (err) {
      toast.error('Failed to submit application.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Become a Mentor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
            />
            <Input
              placeholder="Year of Study"
              type="number"
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
