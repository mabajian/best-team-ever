- UI Improvement:

In milestone 6, we have added our medication icons so users are now able to customize their pills' appearances. This UI allows users to quickly recognize what medication they have through a visual queue. Furthermore, we have restructured the medication history page such that it shows all the medication in a date-organized list depending on which profile the user selects to view. We have also changed the pill history such that when you select a specific pill, it will display whether that profile has taken the pill, and when they took it.

- Explanation of data visualization:

(Data visualization Screenshot: Medication History - see last image below in "Screenshots")
For our data visualization, we are displaying a profile's medication history. This visualization is the result of an internal function that generates data based on a user's input in the backend, and then updates the frontend's visuals with that new information. In other words, a user can add a new medication for a profile, which will cause our function to pull that information and update the profile's medication history to show that new medication.

Data visualization screenshot examples
![Image of home_before](screenshots/home_before.png)
As you can see, this is the current home page for this profile. The profile doesn't have any medication to take on this date, and thus nothing shows up. 

![Image of history_before](screenshots/history_before.png)
Here is what the profile's current medication looks like. As all of these medications are to be taken on different days, nothing is shown on the home page.


![Image of add_med](screenshots/add_med.png)
Here, the medication is being added. Pay attention to the start date and times per day inputted. This particular medication will be taken 4 times on May 30th.

![Image of home_after](screenshots/home_after.png)
After adding the medication, the backend creates 4 entries to insert into the history table. Notice that the timing of the medication are all different. 

![Image of history_after](screenshots/history_after.png)
The profile's history is of course updated to reflect this new medication. The list comes nicely sorted.





- Screenshots:

![Image of login](screenshots/login.png)
![Image of create-account](screenshots/create-account.png)
![Image of no-profile](screenshots/no-profile.png)
![Image of add-profile](screenshots/add-profile.png)
![Image of homepage](screenshots/homepage.PNG)
![Image of add-pill-1](screenshots/add-pill-1.PNG)
![Image of add-pill-2](screenshots/add-pill-2.PNG)
![Image of all-meds](screenshots/all-meds.PNG)
![Image of pill-detail](screenshots/pill-detail.PNG)
![Image of navbar](screenshots/navbar.PNG)
![Image of dropdown](screenshots/dropdown.PNG)
![Image of manage-profiles](screenshots/manage-profiles.PNG)
![Image of view-profile](screenshots/view-profile.PNG)
![Image of edit-profile](screenshots/edit-profile.PNG)
![Image of view-history](screenshots/view-history.PNG)
![Image of pill-history](screenshots/pill-history.png)
![Image of account-settings](screenshots/account-settings.png)
![Image of edit-account](screenshots/edit-account.PNG)
![Image of change-pw](screenshots/change-pw.PNG)
![Image of help](screenshots/help.PNG)

(Data visualization: Medication History - image below)

![Image of med-history](screenshots/med-history.PNG)
