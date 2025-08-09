import { Id } from '@/convex/_generated/dataModel';

export interface Mentor {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  clerkId: string;
  email?: string;
  role: "student" | "mentor" | "admin";
  mentorStatus: "none" | "pending" | "approved" | "rejected";
  bio?: string;
  subjects?: string[];
  applicationDetails?: {
    university: string;
    yearOfStudy: number;
    gradesUrl?: string;
  };
}
