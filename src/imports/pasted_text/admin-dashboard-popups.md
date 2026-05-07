You are updating an existing FIXGO admin dashboard design system.

IMPORTANT:
- ONLY implement the requested popup/modal and action functionality updates.
- Do NOT redesign any existing pages.
- Do NOT change layout, spacing, colors, typography, sidebar, navbar, tables, cards, filters, or responsiveness.
- Maintain the exact existing design system and UI consistency.

--------------------------------------------------

🎯 GOAL:

Add row-click detail popups/modals and action confirmation popups to the following existing pages:

1. Bookings
2. Clients Management
3. Artisan Management
4. Service Management
5. Payments

Only these interaction and popup changes should be added.

--------------------------------------------------

🧩 GLOBAL MODAL RULES

Use the existing FIXGO design system.

All popups/modals should:
- Have clean modern SaaS modal styling
- Use rounded corners
- Soft shadow
- Proper spacing
- Close button (X)
- Overlay background
- Smooth appearance animation
- Responsive behavior

Modal size:
- Medium to large depending on content

Do NOT redesign table structures.

--------------------------------------------------

📄 1. BOOKINGS PAGE UPDATES

BOOKING ROW INTERACTION:
- Clicking a booking row should open a Booking Details popup/modal.

ACTIONS BUTTON:
Only include:
- View Details

View Details should open the same booking details popup.

--------------------------------------------------

BOOKING DETAILS MODAL CONTENT:

Include:
- Booking ID
- Customer info
- Assigned artisan
- Service type
- Booking date & time
- Address/location
- Payment status
- Booking status
- Price summary
- Notes/comments
- Timeline/status progress (optional), etc. Whatever feels necessary and already in the mock data, we will extend the fields when integrating api from backend. 

Use clean section grouping inside modal.

--------------------------------------------------

📄 2. CLIENT MANAGEMENT PAGE UPDATES

CLIENT ROW INTERACTION:
- Clicking a client row should open Client Details popup/modal.

--------------------------------------------------

ACTIONS BUTTON OPTIONS:

1. View Details
- Opens Client Details popup

2. Deactivate
- Opens confirmation popup/modal

3. Delete
- Opens confirmation popup/modal

--------------------------------------------------

CLIENT DETAILS MODAL CONTENT:

Include:
- Client avatar
- Full name
- Email
- Phone
- Registration date
- Total bookings
- Payment history summary
- Current status
- Address/location
etc. Whatever feels necessary and already in the mock data, we will extend the fields when integrating api from backend. 

--------------------------------------------------

DEACTIVATE CONFIRMATION POPUP:

Content:
- Warning message
- Cancel button
- Confirm deactivate button

--------------------------------------------------

DELETE CONFIRMATION POPUP:

Content:
- Destructive warning message
- Cancel button
- Delete button

Use red destructive action styling.

--------------------------------------------------

📄 3. ARTISAN MANAGEMENT PAGE UPDATES

ARTISAN ROW INTERACTION:
- Clicking an artisan row should open Artisan Details popup/modal.

--------------------------------------------------

ACTIONS BUTTON OPTIONS:

1. View Details
- Opens Artisan Details popup

2. Deactivate
- Opens confirmation popup

3. Delete
- Opens confirmation popup

--------------------------------------------------

ARTISAN DETAILS MODAL CONTENT:

Include:
- Artisan avatar
- Full name
- Service category
- Rating
- Completed jobs
- Verification status
- Availability status
- Contact info
- Address/location
- Earnings summary
 
- Recent bookings/activity   etc. Whatever feels necessary and already in the mock data, we will extend the fields when integrating api from backend.  

--------------------------------------------------

DEACTIVATE + DELETE POPUPS:
Use same confirmation popup system as Client Management.

--------------------------------------------------

📄 4. SERVICE MANAGEMENT PAGE UPDATES

IMPORTANT:
Only add popup functionality for SERVICE LIST rows.
Do NOT modify service categories section.

--------------------------------------------------

SERVICE ROW INTERACTION:
- Clicking a service row should open Service Details popup/modal.

--------------------------------------------------

SERVICE DETAILS MODAL CONTENT:

Include:
- Service image/icon
- Service name
- Category
- Base price
- Assigned artisans
- Active bookings
- Service description
- Estimated duration
- Status
etc. Whatever feels necessary and already in the mock data, we will extend the fields when integrating api from backend. 

--------------------------------------------------

IMPORTANT:
Do NOT modify existing action buttons for services.

--------------------------------------------------

📄 5. PAYMENTS PAGE UPDATES

PAYMENT ROW INTERACTION:
- Clicking a payment/transaction row should open Payment Details popup/modal.

--------------------------------------------------

ACTIONS BUTTON:

Only include:
- View Details

No edit/delete/deactivate actions.

--------------------------------------------------

PAYMENT DETAILS MODAL CONTENT:

Include:
- Transaction ID
- Booking ID
- Customer
- Artisan
- Payment amount
- Platform fee

- Transaction status
- Transaction date/time
- Invoice/reference number
- Payment breakdown   etc. Whatever feels necessary and already in the mock data, we will extend the fields when integrating api from backend.  

--------------------------------------------------

📱 RESPONSIVENESS

Ensure all modals work properly on:
- Desktop
- Tablet
- Mobile

Mobile behavior:
- Modal becomes fullscreen or near-fullscreen
- Proper scrolling for long content

--------------------------------------------------

🧪 MOCK DATA

Use realistic mock content for all modal details and confirmations.

--------------------------------------------------

⚙️ FRONTEND DEVELOPMENT AWARENESS

This design will later be converted into a React production application.

Requirements:
- Design popups as reusable modal components
- Use reusable confirmation dialog component
- Maintain clean component hierarchy
- Ensure developer-friendly structure

--------------------------------------------------

🔁 STRICT UPDATE RULE

ONLY add:
- Row click popup interactions
- Detail modals
- Confirmation popups
- Required action button updates

Do NOT redesign or alter anything else in the dashboard system.
