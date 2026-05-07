You are updating an existing FIXGO admin dashboard design system.

IMPORTANT:
- ONLY implement the requested navbar/profile/logout/notification interaction updates.
- Do NOT redesign any existing pages.
- Do NOT modify layout structure, spacing, typography, colors, sidebar, tables, cards, responsiveness, or existing page designs.
- Maintain exact UI consistency with the current FIXGO dashboard system.

--------------------------------------------------

🎯 GOAL

Add interactive dropdowns, popups, and notification system behavior for:

1. Admin profile section in top navbar
2. Sidebar footer logout button
3. Notifications button/system

Only these interaction-related updates should be added.

--------------------------------------------------

🧩 GLOBAL UI RULES

All dropdowns/modals/popups should:
- Follow the existing FIXGO SaaS design system
- Use soft shadows
- Rounded corners
- Smooth animations/transitions
- Clean spacing
- Modern minimal styling
- Proper hover states
- Responsive behavior

Do NOT redesign navbar or sidebar layouts.

--------------------------------------------------

👤 1. TOP NAVBAR PROFILE DROPDOWN

CURRENT AREA:
The top navbar already contains:
- Admin avatar
- Admin name
- Admin role/title

--------------------------------------------------

NEW INTERACTION:

When clicking the admin profile section, open a dropdown menu/popover.

--------------------------------------------------

PROFILE DROPDOWN OPTIONS:

1. View Profile
- Opens profile page or profile modal trigger

2. Logout
- Opens logout confirmation popup/modal

--------------------------------------------------

LOGOUT CONFIRMATION MODAL

Include:
- Warning icon
- Confirmation text
- Cancel button
- Logout button

Use subtle destructive styling for logout button.

--------------------------------------------------

🚪 2. SIDEBAR FOOTER LOGOUT

The existing logout button in sidebar footer should:
- Use the SAME logout confirmation popup/modal
- Reuse same component/system as navbar logout

Do NOT create separate logout modal designs.

--------------------------------------------------

🔔 3. NOTIFICATION SYSTEM

CURRENT AREA:
Top navbar notification bell/button.

--------------------------------------------------

NEW INTERACTION:

When clicking the notification button:
- Open notification dropdown/modal panel

--------------------------------------------------

🔢 NOTIFICATION COUNT BADGE

The notification button should display:
- Unread notification count badge
- Small colored circle/badge
- Auto-hide when count = 0

Example:
- 2 unread notifications
- 5 unread notifications

--------------------------------------------------

📋 NOTIFICATION PANEL STRUCTURE

Panel should include:

HEADER:
- Title: Notifications
- Close (X) button
- Mark All Read button

BODY:
List of notifications with:
- Icon/avatar
- Notification title
- Small description/message
- Timestamp
- Delete button/icon per notification

--------------------------------------------------

📌 UNREAD NOTIFICATION DESIGN IDEA

Unread notifications should be visually identifiable using:
- Slightly highlighted background
- Small blue dot indicator
- Slightly bolder text

Read notifications:
- Normal background
- Muted text color

--------------------------------------------------

🖱️ NOTIFICATION INTERACTIONS

1. Clicking a notification:
- Marks it as read
- Removes unread indicator

2. Delete button per notification:
- Removes only that notification

3. Mark All Read button:
- Marks every notification as read

--------------------------------------------------

🧹 CLEAR ALL FUNCTIONALITY

IMPORTANT:

Only show “Clear All” button when:
- All notifications are already marked as read

Behavior:
- Deletes all notifications

Use subtle destructive styling.

--------------------------------------------------

📦 EMPTY STATE

If there are no notifications:
Show elegant empty state with:
- Icon/illustration
- “No notifications” message

--------------------------------------------------

🌍 MULTI-LANGUAGE SUPPORT (EN / FR)

Dashboard supports English and French.

Requirements:
- All dropdown labels, buttons, modal texts, and notification texts should support localization
- Use flexible text containers
- Avoid fixed-width dropdown sizing
- Ensure French text does not break layout

Examples:
- View Profile / Voir le profil
- Logout / Déconnexion
- Notifications / Notifications
- Mark All Read / Tout marquer comme lu
- Clear All / Tout effacer

--------------------------------------------------

📱 RESPONSIVENESS

Desktop:
- Notification dropdown panel near navbar bell icon
- Profile dropdown aligned under avatar

Tablet/Mobile:
- Proper positioning
- Scrollable notification list
- Touch-friendly interactions
- Fullscreen modal behavior if necessary

--------------------------------------------------

🧪 MOCK DATA

Use realistic notification examples:

- “New booking request received”
- “Payment completed successfully”
- “Artisan verification pending”
- “Client account deactivated”

Use realistic timestamps:
- 2 min ago
- 1 hour ago
- Yesterday

--------------------------------------------------

⚙️ FRONTEND DEVELOPMENT AWARENESS

This design will later be converted into a React production application.

Requirements:
- Reusable dropdown component
- Reusable modal component
- Reusable notification item component
- Dynamic notification badge structure
- Developer-friendly hierarchy and auto-layout

--------------------------------------------------

🔁 STRICT UPDATE RULE

ONLY add:
- Profile dropdown
- Logout confirmation modal
- Notification panel
- Notification interactions
- Notification count badge
- Localization-aware text handling

Do NOT redesign or alter anything else in the dashboard system.