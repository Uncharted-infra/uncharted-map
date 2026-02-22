# AGENTS.md — Uncharted Context + Cursor Plan Mode

Uncharted is an **AI travel agent**, not a general chatbot and not a generic SaaS dashboard.

Users talk to Uncharted to **explore destinations, plan trips, and book real travel**.

The website is a consumer landing experience with an embedded chat interface — similar in interaction model to ChatGPT, Lovable, or Manus — but focused entirely on real-world travel.

The agent should feel like:

**a travel agent in your pocket**

Not a productivity tool.  
Not a developer platform.  
Not a B2B analytics dashboard.

---

## Critical Design Rule (VERY IMPORTANT)

You are **NOT allowed to redesign the UI system.**

The current UI components, typography, spacing scale, color tokens, and design language are the source of truth.

You may:
• Reuse components  
• Recompose components  
• Extend components carefully  
• Add new components that MATCH the system  

You may NOT:
• Replace the design system  
• Introduce a second UI library  
• Change typography scale  
• Change color primitives  
• Create one-off styled components that break consistency  
• Convert the site into a dashboard aesthetic  

This repo should visually feel like the same product, just with more pages and functionality.

If you believe a design system change is required, you must explain why and ask first.

---

## Typography

The site uses two fonts:

**Fenix** — Default font for the site and Map UI.  
Use for all landing content, chat messages, headings, paragraphs, and UI text. Applied via `font-landing`.

**Departure Mono** — Only for navbar branding, sidebar titles, and major control labels.  
Applied via `font-navbar-title`.

Do not introduce additional fonts.

---

## Website Goals

This is NOT documentation and NOT an admin panel.

This is a **conversion-focused consumer landing site** whose job is to:

1. Explain what Uncharted does in seconds  
2. Let users try the agent immediately  
3. Build trust  
4. Encourage account creation  

The homepage must communicate:
• This is an AI travel agent  
• It can actually handle travel logistics  
• It works before, during, and after a trip  

Avoid enterprise language like:
“workflow optimization”  
“productivity platform”  
“AI workspace”

Use consumer language:
“trip”  
“weekend”  
“book”  
“plans”  
“where to go”

---

## Chat Interface Principles

The chat is the **primary feature**, not a support widget.

It must feel like:
• the product itself  
• interactive  
• immediate  

The landing page should guide users to naturally type messages like:

“weekend trips from chicago”  
“plan a 5 day italy trip”  
“find hotels in kyoto”

Do NOT treat chat as a contact form.

**Primary conversion = user sending their first message.**

---

## Maps (Internal Concept)

Uncharted internally measures agent work using **Maps**.

A Map represents when the agent actively performs travel work such as:
• searching real travel options  
• building itineraries  
• organizing plans  
• preparing bookings  

Users do not need implementation details in the UI, but the site should communicate:

Uncharted is free to explore ideas, and becomes more powerful when actively helping.

---

# Landing Page Structure (Non-Negotiable)

**Hero → Chat Prompting → Explore → Plan → Book → How It Works → Pricing → Demo CTA → Closing Message**

The homepage is a narrative journey, not stacked marketing sections.

No abrupt visual resets.  
No hard background swaps.  
No template-style blocks.

The user should feel like they are moving through the same journey they would take with a real travel agent.

---

## Progressive Trust Rule

Explore → curiosity  
Plan → confidence  
Book → reliance  

If a section repeats the previous message, it is wrong.

---

## Animation & Motion Rules

Allowed:
• soft fades  
• parallax movement  
• message appearing  
• progressive reveal  
• micro-interactions  

Not allowed:
• flashy marketing effects  
• bouncing animations  
• looping hero videos  
• decorative loaders  

Think Apple product page, not startup template.

---

# Map (The Product)

**Map is the actual Uncharted app.**  
Like OpenAI has ChatGPT → Uncharted has Map.

The landing site convinces.  
Map performs the travel work.

Map must feel like you are texting a real travel agent.

It is not a dashboard and not a trip spreadsheet.

---

## Map Design Philosophy

Map is a **conversation-first travel workspace**.

Everything the user does (explore, plan, book) happens inside the chat.

There are NO separate “modes” pages.

Explore, Plan, and Book exist as agent capabilities — not UI navigation.

The chatbox is the center of the entire product.

---

## Map Layout (Built with shadcn)

Three-column structure:

**Left Sidebar — Navigation**  
**Center — Conversation (Primary Area)**  
**Right Panel — Contextual Travel Details**

---

### Left Sidebar (Persistent Navigation)

Icons use **lucide-react**.

Top buttons:

1. Search — search across trips & conversations  
2. Trips — active and past trips  
3. Friends — shared trips & social discovery  
4. Luggage — saved documents (tickets, reservations, visas)  
5. Journey — saved places (restaurants, hotels, attractions)

Bottom:

Profile + Settings

Sidebar labels use **Departure Mono**.

---

### Center Panel (Conversation)

This is Map.

ChatGPT-like message interface:
• streaming assistant responses  
• user messages  
• rich travel cards  
• itinerary blocks  
• booking confirmations  

The input box supports:
• natural language  
• follow-ups  
• quick actions  
• uploads (later)  

The user never leaves chat to plan travel.

---

### Explore / Plan / Book in Chat

The agent determines intent automatically:

Explore → recommendations, ideas  
Plan → itinerary building, coordination  
Book → reservations and confirmations  

These are **behaviors**, not buttons.

---

### Right Context Panel

Dynamic panel that updates based on conversation:

May show:
• itinerary timeline  
• hotel cards  
• flight details  
• reservation status  
• saved places  

This panel is read-only context — not a control center.

---

## What Map Is NOT

Do NOT design:
• spreadsheet itineraries  
• kanban boards  
• project management views  
• dashboards with analytics panels  
• filters everywhere  

If it looks like Notion/Linear/Airtable — it is wrong.

Map should feel like:
**iMessage + a travel concierge.**

---

## Visual Continuity

Map must still respect the landing site’s design language:
• same typography  
• same color tokens  
• same spacing system  

Map is a continuation of the website — not a separate product.

---

## Implementation Constraints

Use:
• shadcn components  
• existing tokens  
• lucide icons  

Do NOT introduce:
• new UI frameworks  
• new grid systems  
• new animation libraries  

---

# Cursor Plan Mode

Review this plan thoroughly before making code changes. For every issue:

• explain tradeoffs  
• give an opinionated recommendation  
• ask for input before proceeding  

### Engineering Preferences

• DRY is important  
• well-tested code is non-negotiable  
• engineered enough (no hacks, no over-abstraction)  
• handle edge cases  
• explicit > clever  

---

## Review Sections

1. Architecture review  
2. Code quality review  
3. Test review  
4. Performance review  

After each section, pause and ask for feedback.

---

## For Each Issue Found

Provide:
• concrete description with file references  
• 2–3 options (including do nothing)  
• effort, risk, impact, maintenance burden  
• recommendation mapped to preferences  
• explicit confirmation request  

Number issues and letter options.  
Recommended option must always be first.

---

## Before Starting

Ask which mode:

**1 — BIG CHANGE:** full interactive review (max 4 issues per section)  
**2 — SMALL CHANGE:** one question per review section  

Do not assume priorities or timelines.