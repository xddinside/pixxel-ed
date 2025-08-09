'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function MentorDashboard({ studentIds }: { studentIds: Id<"users">[] }) {
  const students = useQuery(api.users.getUsersByIds, { userIds: studentIds ?? [] });
  const currentUser = useQuery(api.users.getCurrentUser);


  if (students === undefined || currentUser === undefined) {
    return <div>Loading students...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Students ({students.length})</h2>
      {students.length === 0 ? (
        <p>You don&apos;t have any students yet.</p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => {
              const chatId = [currentUser?._id, student._id].sort().join('_');
              return(
                <Card key={student._id}>
                  <CardHeader>
                    <CardTitle>{student.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <Link href={`/chat/${chatId}`}>
                      <Button className="mt-4 cursor-pointer">Chat</Button>
                    </Link>
                  </CardContent>
                </Card>
              )})}
          </div>
        )}
    </div>
  );
}

function StudentDashboard({ mentorIds }: { mentorIds: Id<"users">[] }) {
  const mentors = useQuery(api.users.getUsersByIds, { userIds: mentorIds ?? [] });
  const currentUser = useQuery(api.users.getCurrentUser);

  if (mentors === undefined || currentUser === undefined) {
    return <div>Loading mentors...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Mentors ({mentors.length})</h2>
      {mentors.length === 0 ? (
        <p>You haven&apos;t connected with any mentors yet. <a href="/find-mentor" className="text-blue-500 underline">Find one now!</a></p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => {
              const chatId = [currentUser?._id, mentor._id].sort().join('_');
              return(
                <Card key={mentor._id}>
                  <CardHeader>
                    <CardTitle>{mentor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{mentor.email}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {mentor.subjects?.map((subject, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
                          {subject}
                        </span>
                      ))}
                    </div>
                    <Link href={`/chat/${chatId}`}>
                      <Button className="mt-4 cursor-pointer">Chat</Button>
                    </Link>
                  </CardContent>
                </Card>
              )})}
          </div>
        )}
    </div>
  );
}

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        Loading dashboard...
      </div>
    );
  }

  if (currentUser === null) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        Please log in to see your dashboard.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-left mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You are logged in as a {currentUser.role}.
        </p>
      </div>

      {currentUser.role === 'mentor' && <MentorDashboard studentIds={currentUser.studentIds ?? []} />}
      {currentUser.role === 'student' && <StudentDashboard mentorIds={currentUser.mentorIds ?? []} />}

    </div>
  );
}
