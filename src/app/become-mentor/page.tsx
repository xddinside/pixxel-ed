'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/ui/multi-select';
import { Doc } from '@/convex/_generated/dataModel';

const subjects = [
  { label: 'Mathematics', value: 'mathematics' },
  { label: 'Science', value: 'science' },
  { label: 'Physics', value: 'physics' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Biology', value: 'biology' },
  { label: 'History', value: 'history' },
  { label: 'Geography', value: 'geography' },
  { label: 'English', value: 'english' },
  { label: 'Computer Science', value: 'computer-science' },
];

export default function BecomeMentorPage() {
  const { isSignedIn, isLoaded } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [university, setUniversity] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitted' | 'error'>('idle');
  const applyToBeMentor = useMutation(api.users.applyToBeMentor);

  useEffect(() => {
    if (currentUser?.mentorStatus && (currentUser.mentorStatus === 'pending' || currentUser.mentorStatus === 'approved')) {
      setSubmissionStatus('submitted');
    }
  }, [currentUser]);


  if (!isLoaded || currentUser === undefined) return <div className="p-4">Loading...</div>;
  if (!isSignedIn) return <div className="p-4">Please sign in to apply.</div>;

  const handleSubjectChange = (newSubjects: string[]) => {
    if (newSubjects.length > 3) {
      toast.error("You can select a maximum of 3 subjects.");
      return;
    }
    setSelectedSubjects(newSubjects);

    // Clean up grades for subjects that are no longer selected
    const newGrades = { ...grades };
    Object.keys(newGrades).forEach(subject => {
      if (!newSubjects.includes(subject)) {
        delete newGrades[subject];
      }
    });
    setGrades(newGrades);
  };

  const handleGradeChange = (subject: string, value: string) => {
    setGrades(prev => ({ ...prev, [subject]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const yearNum = parseInt(yearOfStudy, 10);
    if (isNaN(yearNum) || yearNum < 1) {
      toast.error('Please enter a valid year of study.');
      return;
    }
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject.');
      return;
    }

    const orderedGrades = selectedSubjects.map(subject => grades[subject] || '');
    if (orderedGrades.some(grade => grade.trim() === '')) {
      toast.error('Please enter grades for all selected subjects.');
      return;
    }

    try {
      await applyToBeMentor({
        university,
        yearOfStudy: yearNum,
        subjects: selectedSubjects,
        grades: orderedGrades,
      });
      toast.success('Application submitted!');
      setSubmissionStatus('submitted');
      setUniversity('');
      setYearOfStudy('');
      setSelectedSubjects([]);
      setGrades({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error('Failed to submit application.', {
        description: errorMessage,
      });
      setSubmissionStatus('error');
    }
  };

  if (submissionStatus === 'submitted') {
    return (
      <div className="max-w-md mx-auto mt-12 p-4 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Application Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Thank you for your application. We will review it and get back to you soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Become a Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="University / School"
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
            <MultiSelect
              options={subjects}
              value={selectedSubjects}
              onChange={handleSubjectChange}
              placeholder="Select up to 3 subjects"
            />
            {selectedSubjects.map((subject) => (
              <Input
                key={subject}
                placeholder={`Recent grade in ${subjects.find(s => s.value === subject)?.label}`}
                value={grades[subject] || ''}
                onChange={(e) => handleGradeChange(subject, e.target.value)}
                required
              />
            ))}
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
