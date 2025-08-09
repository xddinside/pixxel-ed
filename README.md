# PixxelEd

## TODO

- [x] make it deploy (Vercel)
- [x] create mock landing page
- [x] setup Convex (for database and backend stuff)
- [x] setup auth (using Clerk with ConvexAuth)

- [ ] complete mentor form with the correct schema and data being stored like in the point below
- [ ] in the applicationDetails (for becoming a mentor), take in fields like: 
    - school / university name
    - subject(s) user wants to mentor in (max 3 subjects)
        - drop down list of a lot of subjects, mostly popular ones like maths, science, physics, chemistry etc.
    - recent grades in the subject user is mentoring in
        - if mentoring in multiple subjects, show input boxes for each subject (eg: if mentoring in 2 subjects, then show 2 input boxes for recent Grades in (subject 1) and Grades in (subject 2) )


- [ ] when user signs up, show them two nicely styled cards that have choices to either join as a student, or join as a mentor. 
    - [ ] if user clicks on join as a mentor, redirect them to the /become-mentor page
    - [ ] if user clicks on student, redirect them to a new page (yet to create), where they can see the mentors that are already registered
        - The students can choose their mentor from this page.


- [ ] create dashboards for student and mentor
    - [ ] in the mentor dashboard, the user can see it only if they're a mentor, and can see their students and can chat with them.
    - [ ] in the student dashboard, the user can see their mentors (only if they're a student), and can chat with their mentors.

- [ ] create chat section between mentors and students
    - [ ] setup image and document uploads and doc downloads in the chat for both sides

- [ ] complete landing page

### TODO if extra time (not in order)

- in the mentor form, take grades in image and pdf form, and make them viewable from the admin's side on his dashboard
- allow mentor to stop accepting students any longer, which would prevent them from being visible in the page where students can search for mentors. the mentors can still be a mentor and chat with their current students however.
