# PixxelEd

### known endpoints

- /dashboard
- /find-mentor
- /admin (only accessible by admin)
- /role-selection (automatically redirected here on sign up)

## TODO

- [x] make it deploy (Vercel)
- [x] create mock landing page
- [x] setup Convex (for database and backend stuff)
- [x] setup auth (using Clerk with ConvexAuth)

- [x] complete mentor form with the correct schema and data being stored like in the point below
- [x] in the applicationDetails (for becoming a mentor), take in fields like: 
    - school / university name
    - subject(s) user wants to mentor in (max 3 subjects)
        - drop down list of a lot of subjects, mostly popular ones like maths, science, physics, chemistry etc.
    - recent grades in the subject user is mentoring in
        - if mentoring in multiple subjects, show input boxes for each subject (eg: if mentoring in 2 subjects, then show 2 input boxes for recent Grades in (subject 1) and Grades in (subject 2) )
    - [x] take the user's name in the form as well (and tell them that it'll show up to the students applying to them subtly) 
    - [x] take the user's bio as well, where they can tell the mentor and the students why they should pick them

- [x] when user signs up, show them two nicely styled cards that have choices to either join as a student, or join as a mentor. 
    - [x] if user clicks on join as a mentor, redirect them to the /become-mentor page
    - [x] if user clicks on student, redirect them to a new page (find-mentor), where they can see the mentors that are already registered
        - The students can choose their mentor from this page.
        - [x] make it so that the student can click on the connect button only once, and then it shows a toast to show that they're connected. also instead of the connect button, show Connected to mentor (after user has clicked on it, to make the button disabled).

- [x] make a "none" role, and make it the default
- [x] make it so that if a user's role is "none", always redirect them to the /role-selection page

- [x] handle the connection between the students and the mentor, so that every student stores who their mentor is and every mentor stores who their student is (so that we can access them to show them to the user)

- [x] when the student is selected in the /role-selection, make it so that the user gets redirected to a new page where the user has to write their details (like how we've implemented the /become-mentor page). take in details and store them, such as:
    - Name
    - Subjects [ (that they'd like to get mentored in, only to show their preference, doesn't lock them), (also, take it in a dropdown like we've done in /become-mentor) ]
    - Bio (that their mentors will be able to see, to tell them about themselves)
    - School / uni
    - Grades (in the subject they'd selected, just to give the mentors an idea of their students)

- [x] when the mentor submits the form (in /become-mentor), set the name outside the application details as well 
- [x] redirect the mentor (after they select the role as mentor) to the /become-mentor page always (isntead of the dashboard), until they fill the form in the /become-mentor page.

- [x] create dashboards for student and mentor
    - [x] in the mentor dashboard, the user can see it only if they're a mentor, and can see their students and can chat with them.
        - [x] use the studentIDs to iterate through and show each student
    - [x] in the student dashboard, the user can see their mentors (only if they're a student), and can chat with their mentors.
        - [x] use the mentorIds to iterate through and show each mentor

- [x] add dummy data for convex table to show multiple mentors (manly for the find-mentor page)

- [x] create chat section between mentors and students
    - [x] setup image and document uploads and doc downloads in the chat for both sides

- [x] make the file upload buttons nicer (and check document upload and download like pdf)

- [ ] add a notification button on the topright in nav between the user profile from clerk and the mode toggle button (the notif button shows only if the user is logged in).
    - Handle the logic to send a notification there in a notification bubble if a chat message is received from anyone.

- [ ] change the mutation so that when a user is deleted, it gets the corresponding connected student / admin (if any) and then removes the id of the user that was deleted from their list of connected student / mentor Ids. basically, let's say mentor A had a student B, and A deletes his account. then in the mentorIds of B, we should delete the Id of A (as A no longer exists in our db after deletion)

- [ ] improve the landing page
    - remove the excess empty space below the last part
    - add footer at the bottom of the page
    - (maybe) make the space between each showcase smaller (so we have to scroll less)

### TODO if extra time (not in order)

- [ ] in the mentor form, take grades in image and pdf form, and make them viewable from the admin's side on his dashboard
- [ ] allow mentor to stop accepting students any longer, which would prevent them from being visible in the page where students can search for mentors. the mentors can still be a mentor and chat with their current students however.
