You are extending an existing admin dashboard design system for the FIXGO platform.

IMPORTANT:
- Use the attached dashboard/base layout as the primary design system reference.
- Use the attached Service Management and Message page designs as content references.
- Replace all existing “Coming Soon” placeholder sections with fully designed production-ready interfaces.
- Maintain EXACTLY the same visual system:
  - Sidebar
  - Navbar
  - Typography
  - Colors
  - Spacing
  - Buttons
  - Tables
  - Cards
  - Inputs
  - Responsive behavior

Do NOT redesign the dashboard structure.

--------------------------------------------------

🎯 GOAL:

Design TWO complete responsive dashboard pages:

1. Service Management
2. Message

These pages must feel like part of the same FIXGO admin dashboard system.

--------------------------------------------------

🧱 GLOBAL LAYOUT RULES

- Keep sidebar identical
- Keep navbar identical
- Keep same spacing system
- Keep same card/table style
- Reuse existing UI components
- Use clean auto-layout and developer-friendly grouping

--------------------------------------------------

📄 PAGE 1 — SERVICE MANAGEMENT

Create a modern service management interface for platform services.

--------------------------------------------------

1. PAGE HEADER
- Title: “Service Management”

--------------------------------------------------

2. FILTER & ACTION BAR

as shown 

--------------------------------------------------

3. SERVICE TABLE / GRID

Design a clean service listing section.

Columns or card details:
as shown 






--------------------------------------------------4. ADD SERVICE: priority options are: from backend code: NORMAL = "normal", "Normal"
    URGENT = "urgent", "Urgent"      Also 5. ADD NEW CATEGORY: When pressed ad new category button, it wil show a pop up to input fields: from backend code: name        = models.CharField(max_length=100, unique=True)
    icon        = models.ImageField(
        upload_to="services/category_icons/",
        blank=True,
        null=True,
        help_text="Square icon / logo shown in the category grid.",
    )
    order       = models.PositiveSmallIntegerField(
        default=0,
        help_text="Display order — lower numbers appear first.", /// by default will be set to the latest+1 from frontend, 
    )
    is_active   = models.BooleanField(default=True)   /// so design a pop up for that and save button, then it will be added to the category list. I dont have the pop up on the design, so make it on your own based on the context. 
    6. ANALYTICS CARD on top as shown 

Include small summary cards:
as shown 

--------------------------------------------------

📄 PAGE 2 — MESSAGE

Create a modern admin messaging interface.

This should feel similar to a professional SaaS support/chat system as exactly as shown. 

--------------------------------------------------

1. PAGE HEADER
- Title: “Messages”
- Subtitle describing communication management

--------------------------------------------------

2. CHAT LAYOUT STRUCTURE

Split layout into 2 sections:

LEFT PANEL:
as shown 

RIGHT PANEL:
as shown 

--------------------------------------------------

3. MESSAGE STYLES

as shown 




--------------------------------------------------

5. EMPTY STATE

Design elegant empty state when no conversation is selected.

--------------------------------------------------

🧩 COMPONENT REUSE (IMPORTANT)

Reuse existing dashboard components:
- Buttons
- Inputs
- Cards
- Dropdowns
- Avatar styles
- Badges
- Search bars

Avoid introducing inconsistent styles.

--------------------------------------------------

🌍 MULTI-LANGUAGE SUPPORT

Dashboard supports English and French.

Requirements:
- Flexible text containers
- No fixed-width labels
- Layout must remain stable with longer French text

--------------------------------------------------

📱 RESPONSIVENESS

Desktop:
- Full split-panel layout

Tablet:
- Compress sidebar/chat panels intelligently

Mobile:
- Conversation list becomes separate screen
- Chat opens fullscreen
- Sidebar becomes drawer menu

--------------------------------------------------

🧪 MOCK DATA

Service examples:
- Plumbing
- Electrical Repair
- House Cleaning
- AC Maintenance etc as shown  

Chat examples:
- John Doe
- Alex Smith
- Sarah Wilson   etc as shown  

Use realistic message previews and timestamps.

--------------------------------------------------

⚙️ FRONTEND DEVELOPMENT AWARENESS

This design will later be converted into a React production application and deployed to AWS.

Requirements:
- Use reusable component structures
- Maintain developer-friendly hierarchy
- Design all lists/tables/messages as repeatable dynamic components
- Use proper spacing and auto-layout
- Ensure responsive grid/flex compatibility

--------------------------------------------------

🔁 CONSISTENCY RULE

These pages are part of the same FIXGO dashboard ecosystem.
Maintain exact visual consistency with the existing dashboard system.