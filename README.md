# PixxelEd - Mentorship Platform

**PixxelEd** is a full-stack web application developed for the **Pixxelhack Webathon**. It's an EdTech platform designed to connect students seeking academic help with experienced mentors and seniors who can provide subject-specific tutoring.

### Problem Statement

This project addresses the following problem statement:

> *Create a platform that connects students who need help in specific subjects with their mentors or seniors who can tutor them enabling on-demand, subject specific help.*

### ✨ Live Demo

[Link to your deployed Vercel application]

-----

## 🚀 Key Features

PixxelEd is a feature-rich platform with distinct user flows for Students, Mentors, and Administrators.

  * **👥 Role-Based System:** Users can sign up and choose their role as either a **Student** or a **Mentor**, with a dedicated administrative backend.
  * **📝 Detailed Onboarding:**
      * **Mentors:** A comprehensive application form allows aspiring mentors to submit their bio, university, subjects they specialize in (up to 3), and recent grades for each subject.
      * **Students:** A simple setup process where students provide their details to help mentors understand their needs.
  * **🧑‍⚖️ Admin Vetting Dashboard:** An exclusive admin dashboard to review, approve, or reject pending mentor applications, ensuring quality and safety on the platform.
  * **🔍 Mentor Discovery:** Students can browse a gallery of approved mentors, view their profiles and specializations, and connect with them with a single click.
  * **🖥️ Personalized Dashboards:**
      * Mentors can view all their connected students.
      * Students can see all their mentors.
      * Dashboards display indicators for unread messages, making it easy to keep track of conversations.
  * **💬 Real-Time Chat:** Once connected, students and mentors can engage in a one-on-one chat/page.tsx].
  * **📁 File Sharing:** The chat functionality supports uploading and sharing images and documents (like PDFs and text files) to facilitate learning/page.tsx, xddinside/pixxel-ed/pixxel-ed-647eefefe36ce98711d5c06b35607f5f8eeec6c4/src/app/api/uploadthing/core.ts].
  * **🔔 Notifications:** A navigation bar icon alerts users to new, unread chat messages, ensuring prompt communication.
  * **🎨 Animated Landing Page:** A visually appealing landing page built with GSAP and Framer Motion to engage new users.

-----

## 🛠️ Tech Stack

  * **Framework:** [Next.js](https://nextjs.org/) (with Turbopack)
  * **Backend & Database:** [Convex](https://www.convex.dev/)
  * **Authentication:** [Clerk](https://clerk.com/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  * **UI Components:** [shadcn/ui](https://ui.shadcn.com/), Radix UI
  * **File Uploads:** [UploadThing](https://uploadthing.com/)
  * **Animations:** [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/)
  * **Notifications:** [Sonner](https://www.google.com/search?q=https://sonner.emilkowal.ski/)
  * **Language:** [TypeScript](https://www.typescriptlang.org/)

-----

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (v18 or later)
  * pnpm package manager
    ```sh
    npm install -g pnpm
    ```

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/xddinside/pixxel-ed.git
    cd pixxel-ed
    ```

2.  **Install dependencies:**

    ```sh
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following keys. You will need to create accounts with [Convex](https://www.convex.dev/), [Clerk](https://clerk.com/), and [UploadThing](https://uploadthing.com/) to get these values.

    ```env
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    CLERK_WEBHOOK_SECRET=

    # Convex Backend
    NEXT_PUBLIC_CONVEX_URL=

    # UploadThing File Uploads
    UPLOADTHING_SECRET=
    UPLOADTHING_APP_ID=
    ```

4.  **Set up Convex Backend:**
    Run the Convex development server in a separate terminal to sync your schema and functions.

    ```sh
    npx convex dev
    ```

5.  **Run the development server:**

    ```sh
    pnpm dev
    ```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

-----

## 🔮 Future Scope

While the current implementation is robust, here are some features that could be added in the future:

  * **Enhanced Mentor Vetting:** Allow mentors to upload PDFs or images of their transcripts during application for admins to review.
  * **Availability Control:** Give mentors the ability to toggle their visibility in the "Find a Mentor" list, allowing them to stop accepting new students without losing contact with existing ones.
  * **Improved User Deletion Logic:** Implement a system where deleting a user account also removes their ID from their connected students' or mentors' lists.
  * **UI/UX Enhancements:** Add a footer and refine the landing page animations and layout for a more polished user experience.
