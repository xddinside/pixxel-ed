'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function InitialCircle({ name }: { name: string }) {
  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

function MentorDashboard({ studentIds }: { studentIds: Id<"users">[] }) {
  const students = useQuery(api.users.getUsersByIds, { userIds: studentIds ?? [] });

  if (students === undefined) {
    return <div className="text-center py-8">Loading students...</div>;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Students ({students.length})</h2>
      {students.length === 0 ? (
        <p className="text-muted-foreground">You don&apos;t have any students yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center gap-4">
                <InitialCircle name={student.name} />
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{student.email}</p>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Joined: {new Date(student.createdAt).toLocaleDateString()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function StudentDashboard({ mentorIds }: { mentorIds: Id<"users">[] }) {
  const mentors = useQuery(api.users.getUsersByIds, { userIds: mentorIds ?? [] });

  if (mentors === undefined) {
    return <div className="text-center py-8">Loading mentors...</div>;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Mentors ({mentors.length})</h2>
      {mentors.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t connected with any mentors yet.{' '}
          <a href="/find-mentor" className="text-blue-500 hover:underline">Find one now!</a>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center gap-4">
                <InitialCircle name={mentor.name} />
                <div>
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{mentor.email}</p>
                </div>
              </CardHeader>
              <CardContent>
                {mentor.subjects?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentor.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-3">
                  Joined: {new Date(mentor.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return <div className="flex justify-center items-center h-[80vh]">Loading dashboard...</div>;
  }

  if (currentUser === null) {
    return <div className="flex justify-center items-center h-[80vh]">Please log in to see your dashboard.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You are logged in as a <span className="font-semibold">{currentUser.role}</span>.
        </p>
      </header>

      {currentUser.role === 'mentor' && (
        <MentorDashboard studentIds={currentUser.studentIds ?? []} />
      )}
      {currentUser.role === 'student' && (
        <StudentDashboard mentorIds={currentUser.mentorIds ?? []} />
      )}
    </div>
  );
}
