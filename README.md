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
    - [ ] take the user's name in the form as well (and tell them that it'll show up to the students applying to them subtly) 
    - [ ] take the user's bio as well, where they can tell the mentor and the students why they should pick htem

- [x] when user signs up, show them two nicely styled cards that have choices to either join as a student, or join as a mentor. 
    - [x] if user clicks on join as a mentor, redirect them to the /become-mentor page
    - [x] if user clicks on student, redirect them to a new page (yet to create), where they can see the mentors that are already registered
        - The students can choose their mentor from this page.
        - [ ] make it so that on clicking the student can click on the connect button only once, and then it shows toast to show it worked. also instead of the connect button, show Connected to mentor.

- [ ] make a "none" role, and make it the default
- [ ] make it so that if a user's role is "none", always redirect them to the /role-selection page

- [ ] handle the connection between the students and the mentor, so that every student stores who their mentor is and every mentor stores who their student is (so that we can access them to show them to the user)

- [ ] create dashboards for student and mentor
    - [ ] in the mentor dashboard, the user can see it only if they're a mentor, and can see their students and can chat with them.
    - [ ] in the student dashboard, the user can see their mentors (only if they're a student), and can chat with their mentors.

- [ ] create chat section between mentors and students
    - [ ] setup image and document uploads and doc downloads in the chat for both sides

- [ ] improve the landing page
    - remove the excess empty space below the last part
    - add footer at the bottom of the page
    - (maybe) make the space between each showcase smaller (so we have to scroll less)

### TODO if extra time (not in order)

- in the mentor form, take grades in image and pdf form, and make them viewable from the admin's side on his dashboard
- allow mentor to stop accepting students any longer, which would prevent them from being visible in the page where students can search for mentors. the mentors can still be a mentor and chat with their current students however.
