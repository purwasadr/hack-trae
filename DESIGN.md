# DESIGN.md

## Product Design System

This document defines the visual design system, layout rules, component patterns, and UI behavior for the **AI Self-Reflection Coach** web app.

All AI agents, designers, and developers must follow this guide when generating or modifying UI so the product feels consistent, calm, intelligent, and productivity-focused.

---

# 1. Product Identity

## App Name

**AI Self-Reflection Coach**

## Product Purpose

This application helps users reflect on their daily productivity, understand what blocked their progress, classify what was within or outside their control, and turn reflection into practical improvement plans.

The app should not feel like a strict performance tracker. It should feel like a calm coach that helps the user understand their day without judgment.

## Core Product Themes

The UI should communicate:

- Calm focus
- Self-awareness
- Practical improvement
- Encouraging coaching
- Clarity over judgment
- Small progress over perfection

## Emotional Direction

The interface should feel:

- Supportive
- Clear
- Gentle
- Premium
- Organized
- Reflective
- Actionable

Avoid making the app feel:

- Too corporate
- Too clinical
- Too gamified
- Too loud
- Too judgmental
- Too dense

---

# 2. Visual Style

## Design Style

Use a modern SaaS dashboard style with a calm productivity-coaching personality.

The design should combine:

- Clean white/light backgrounds
- Soft green accent colors
- Rounded cards
- Subtle shadows
- Friendly icons
- Clear content hierarchy
- Gentle decorative illustrations
- Spacious layouts

The product should look polished enough for a premium productivity tool but still warm enough for personal reflection.

## Visual Keywords

Use these keywords as guidance when generating UI:

> calm, focused, reflective, clean, soft, intelligent, growth-oriented, encouraging, structured, breathable, modern SaaS, productivity coach

---

# 3. Color System

## Primary Palette

Use green as the primary brand color because it represents growth, clarity, and progress.

```css
--color-primary-50: #f2f9ed;
--color-primary-100: #e3f3d9;
--color-primary-200: #c8e9b8;
--color-primary-300: #a6db8e;
--color-primary-400: #7cc85c;
--color-primary-500: #4ea72e;
--color-primary-600: #3b8e20;
--color-primary-700: #2f721c;
--color-primary-800: #285a1b;
--color-primary-900: #214a19;
```

## Neutral Palette

Use warm neutrals instead of harsh grays.

```css
--color-background: #fafbf8;
--color-surface: #ffffff;
--color-surface-soft: #f6f8f3;

--color-border: #e4e8df;
--color-border-strong: #d4dacd;

--color-text-primary: #111827;
--color-text-secondary: #5f6b5a;
--color-text-muted: #7c8578;
--color-text-soft: #9aa392;
```

## Semantic Colors

Use semantic colors carefully. The app should stay calm even when showing blockers.

```css
--color-success-bg: #eef8e8;
--color-success-text: #2f721c;
--color-success-border: #bfe3ae;

--color-warning-bg: #fff7e8;
--color-warning-text: #b66a00;
--color-warning-border: #f4d39a;

--color-danger-bg: #fff1f0;
--color-danger-text: #c0392b;
--color-danger-border: #f0b5ae;

--color-info-bg: #eff5ff;
--color-info-text: #315ebd;
--color-info-border: #b8ccf5;

--color-neutral-bg: #f4f6f2;
--color-neutral-text: #5f6b5a;
--color-neutral-border: #d9ded3;
```

## Usage Rules

Primary green should be used for:

- Main CTA buttons
- Progress indicators
- Positive status badges
- Coach highlights
- Section numbers
- Check icons
- Focus states

Orange or amber should be used for:

- Partly influenced factors
- Medium impact blockers
- Avoid warnings
- Cautionary suggestions

Red should be used sparingly for:

- High impact blockers
- Repeated distraction patterns
- Critical friction points

Blue should be used sparingly for:

- Informational states
- Reflection count
- Notes
- Neutral analysis metadata

Never use overly saturated neon colors.

---

# 4. Typography

## Font Direction

Use a clean sans-serif typeface.

Recommended fonts:

- Inter
- Geist
- Manrope
- Plus Jakarta Sans
- DM Sans

## Type Scale

```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 32px;
--font-size-4xl: 40px;
```

## Font Weight

```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

## Typography Rules

Page titles should be large, confident, and simple.

Section titles should be clear and scannable.

Body copy should be gentle and easy to read.

Avoid long paragraphs inside cards. Break content into smaller readable groups.

Use bold text only to highlight:

- Labels
- Important insights
- Next steps
- Main conclusions
- Actionable recommendations

---

# 5. Spacing System

Use an 8px spacing system.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

## Layout Spacing Rules

Use generous spacing between major dashboard sections.

Recommended section gap:

```css
gap: 24px;
```

Recommended card padding:

```css
padding: 24px;
```

Recommended compact item padding:

```css
padding: 16px;
```

Do not crowd reflection content. This app should feel breathable.

---

# 6. Border Radius

Use soft rounded corners throughout the app.

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-full: 999px;
```

## Usage Rules

- Small badges: `999px`
- Buttons: `12px`
- Cards: `20px`
- Large dashboard panels: `24px`
- Icon containers: `16px` or full circle

Avoid sharp corners.

---

# 7. Shadow System

Use subtle shadows. The UI should feel soft, not heavy.

```css
--shadow-sm: 0 1px 2px rgba(17, 24, 39, 0.04);
--shadow-md: 0 8px 24px rgba(17, 24, 39, 0.06);
--shadow-lg: 0 16px 40px rgba(17, 24, 39, 0.08);
```

## Shadow Rules

Use shadows mostly on:

- Main cards
- Floating sidebar
- Important diagnosis panels
- CTA buttons

Avoid strong dark shadows.

---

# 8. Layout System

## Main Dashboard Layout

Use a desktop-first dashboard layout.

Recommended structure:

```txt
App Shell
├── Left Sidebar
└── Main Content
    ├── Header / Hero
    ├── Summary Stats
    ├── Latest Reflection
    ├── Control Factor Classification
    ├── Productivity Blocker Analysis
    ├── AI Productivity Diagnosis
    └── Next Practical Plan
```

## Page Container

```css
max-width: 1200px;
margin: 0 auto;
padding: 32px;
```

## Sidebar

The sidebar should be slim, calm, and icon-based.

Recommended width:

```css
width: 72px;
```

Sidebar style:

- White background
- Rounded right or full card shape
- Soft border
- Subtle shadow
- Green active state
- Icon-only navigation

Sidebar items should use simple icons and clear active states.

Active navigation item:

```css
background: #eef8e8;
color: #3b8e20;
```

---

# 9. Component System

# 9.1 Buttons

## Primary Button

Used for main actions such as **New Reflection**.

Style:

```css
background: #3b8e20;
color: white;
border-radius: 12px;
padding: 10px 16px;
font-weight: 600;
box-shadow: 0 8px 20px rgba(59, 142, 32, 0.18);
```

Hover:

```css
background: #2f721c;
```

## Secondary Button

Used for actions such as **History**.

Style:

```css
background: #ffffff;
color: #111827;
border: 1px solid #e4e8df;
border-radius: 12px;
padding: 10px 16px;
font-weight: 600;
```

Hover:

```css
background: #f6f8f3;
```

## Button Rules

Buttons should include icons when helpful.

Use concise labels:

- New Reflection
- View History
- Start Reflection
- Save Plan
- Review Insights

Avoid vague labels like:

- Submit
- Continue
- Click Here

---

# 9.2 Cards

Cards are the core UI pattern.

Base card:

```css
background: #ffffff;
border: 1px solid #e4e8df;
border-radius: 20px;
box-shadow: 0 8px 24px rgba(17, 24, 39, 0.04);
padding: 24px;
```

## Card Rules

Every card should have:

- Clear heading
- Optional short description
- Structured content
- Consistent padding
- Rounded corners
- Soft border

Avoid large unstructured blocks of text.

---

# 9.3 Section Headers

Each major section should have:

- Optional numbered green circle
- Clear title
- Short supporting subtitle

Example:

```txt
[1] Control Factor Classification
A calm split between what you can act on now and what needs a softer response.
```

Section numbers should use green circular badges.

```css
width: 32px;
height: 32px;
border-radius: 999px;
background: #3b8e20;
color: white;
font-weight: 700;
```

---

# 9.4 Status Badges

Use badges to classify reflection insights.

## Within Your Control

```css
background: #eef8e8;
color: #2f721c;
border: 1px solid #bfe3ae;
```

Use icon:

- Shield check
- Check circle
- Leaf

## Partly Influenced

```css
background: #fff7e8;
color: #b66a00;
border: 1px solid #f4d39a;
```

Use icon:

- Scale
- Adjustments
- Split arrows

## Outside Your Control

```css
background: #f4f6f2;
color: #5f6b5a;
border: 1px solid #d9ded3;
```

Use icon:

- Cloud
- Users
- Calendar
- Lock

## High Impact

```css
background: #fff1f0;
color: #c0392b;
border: 1px solid #f0b5ae;
```

## Medium Impact

```css
background: #fff7e8;
color: #b66a00;
border: 1px solid #f4d39a;
```

## Low Impact

```css
background: #eef8e8;
color: #2f721c;
border: 1px solid #bfe3ae;
```

---

# 9.5 Icon Containers

Use icons inside soft rounded containers.

```css
width: 48px;
height: 48px;
border-radius: 16px;
display: flex;
align-items: center;
justify-content: center;
```

Green icon container:

```css
background: #eef8e8;
color: #3b8e20;
```

Blue icon container:

```css
background: #eff5ff;
color: #315ebd;
```

Orange icon container:

```css
background: #fff7e8;
color: #b66a00;
```

Red icon container:

```css
background: #fff1f0;
color: #c0392b;
```

Neutral icon container:

```css
background: #f4f6f2;
color: #5f6b5a;
```

Recommended icon library:

- Lucide React

Recommended icons:

- Leaf
- Brain
- Target
- Calendar
- CheckCircle
- ShieldCheck
- Bell
- Scale
- Users
- Cloud
- ListChecks
- Lightbulb
- TrendingUp
- ClipboardCheck

---

# 10. Page-Specific Design Rules

# 10.1 Dashboard Header

The dashboard header should include:

- Small eyebrow label: `DASHBOARD`
- Main title
- Short supportive subtitle
- Primary action button
- Secondary action button
- Optional soft decorative visual

Example content:

```txt
DASHBOARD

Your AI Self-Reflection Coach

Track your current style, reflect on what matters, and turn insights into practical steps for better productivity.
```

The header should feel welcoming and clear.

Do not make the dashboard title too generic.

Prefer:

```txt
Your AI Self-Reflection Coach
```

Avoid:

```txt
Dashboard
```

---

# 10.2 Summary Stat Cards

Use 3–4 stat cards at the top of the dashboard.

Recommended cards:

1. Main Struggle
2. Current Style
3. Reflection Count
4. Focus Score or Progress Trend

Each stat card should include:

- Icon
- Small uppercase label
- Main value
- Optional helper text

Example:

```txt
MAIN STRUGGLE
staying_focused
```

Example:

```txt
FOCUS SCORE
68%
Keep building momentum
```

The stat cards should give the user a quick emotional and productivity snapshot.

---

# 10.3 Latest Reflection Card

This card should summarize the latest user reflection.

Recommended structure:

```txt
Latest Reflection

Date
May 30, 2026

Reflection Summary
“A meeting-heavy day with only short windows for focused work.”

Goal
Finish my job efficiently
```

Use a quote-style highlight for the reflection summary.

The goal should be clearly visible and preferably use a green label.

---

# 10.4 Control Factor Classification

This section helps users understand what they can control.

Each item should include:

- Icon
- Factor title
- Short explanation
- Next step
- Control status badge

Recommended layout:

```txt
[Icon] Factor title                          [Status Badge]
       Explanation
       Next step: Actionable recommendation
```

Status types:

- Within your control
- Partly influenced
- Outside your control

Tone should be calm and non-judgmental.

Use wording like:

```txt
Next step: Protect the small gaps between meetings for one clearly defined task.
```

Avoid harsh wording like:

```txt
You failed because you did not manage your schedule.
```

---

# 10.5 Productivity Blocker Analysis

This section identifies what reduced productivity.

Each blocker card should include:

- Icon
- Blocker name
- Impact badge
- Pattern
- Suggestion

Recommended layout:

```txt
Competing priorities
High impact

Pattern:
Important work and follow-ups were both asking for attention at the same time.

Suggestion:
Decide your top priority before the day starts and give follow-ups a separate time block.
```

Use high-impact styling carefully. It should inform, not alarm.

---

# 10.6 AI Productivity Diagnosis

This is one of the most important sections.

It should feel like an AI coach insight, not a generic summary.

Recommended structure:

```txt
AI Productivity Diagnosis
A short summary designed to guide tomorrow, not judge today.

Summary
You still moved your goal forward...

Likely pattern
When time is broken into short windows...

Encouraging reframe
This was not a failed day...
```

Style this section slightly differently from other cards.

Recommended treatment:

- Pale green gradient background
- Soft green border
- Brain or leaf icon
- Three-column insight layout on desktop
- Single-column layout on mobile

The diagnosis must always be supportive.

---

# 10.7 Next Practical Plan

This section turns reflection into action.

Recommended structure:

```txt
Next Practical Plan
Small moves to make tomorrow feel more manageable.

Focus for tomorrow:
Protect one top-priority task and contain follow-ups.

Small actions:
- Pick one most important outcome before starting work.
- Block 1 to 2 short focus windows.
- Silence notifications during those windows.

Avoid tomorrow:
- Starting the day without a single clear priority.
- Checking messages continuously.
- Switching tasks each time a new request appears.
```

Use checkmarks for positive actions.

Use soft warning icons for avoid items.

This section should feel practical and motivating.

---

# 11. Content Tone

## Voice

The app voice should be:

- Calm
- Supportive
- Practical
- Honest
- Non-judgmental
- Encouraging

## Writing Principles

Use:

```txt
This was a constrained day, not a failed day.
```

Use:

```txt
Protect one clear task before checking messages.
```

Use:

```txt
Small changes can make tomorrow smoother.
```

Avoid:

```txt
You were unproductive.
```

Avoid:

```txt
You failed to focus.
```

Avoid:

```txt
You need better discipline.
```

## Preferred Words

Use these words often:

- reflect
- clarify
- protect
- focus
- progress
- pattern
- gentle
- practical
- manageable
- momentum
- next step
- small action
- within your control

## Avoid These Words

Avoid overly harsh or clinical words:

- failure
- weakness
- bad behavior
- laziness
- poor performance
- discipline problem
- productivity scorecard

---

# 12. Responsive Behavior

## Desktop

Desktop should use:

- Left sidebar
- Multi-column stat cards
- Wide section cards
- Two-column or three-column content where useful

## Tablet

Tablet should use:

- Collapsible sidebar or top navigation
- Two-column stat cards
- Stacked major sections

## Mobile

Mobile should use:

- Top navigation
- Single-column layout
- Full-width cards
- Larger tap targets
- Sticky primary CTA when useful

Mobile spacing:

```css
padding: 16px;
gap: 16px;
```

Mobile cards:

```css
border-radius: 16px;
padding: 16px;
```

---

# 13. Animation Guidelines

Animations should be subtle and calming.

Use animations for:

- Card entrance
- Button hover
- Progress ring loading
- Badge appearance
- Section reveal

Recommended motion:

```css
transition: all 180ms ease;
```

Card entrance:

```txt
fade in + slight upward movement
duration: 250ms
```

Avoid:

- Bouncy animations
- Excessive motion
- Fast flashing
- Confetti overload
- Distracting effects

---

# 14. Accessibility Rules

All UI must follow accessibility best practices.

## Requirements

- Text must have sufficient contrast.
- Buttons must have visible focus states.
- Icons should not be the only way to communicate meaning.
- Use semantic HTML.
- Interactive elements must be keyboard accessible.
- Avoid very small text below 12px.
- Do not rely only on color for status.

## Focus State

```css
outline: 3px solid rgba(78, 167, 46, 0.35);
outline-offset: 2px;
```

---

# 15. Recommended Component Names

Use these component names across the project:

```txt
AppShell
SidebarNav
DashboardHeader
SummaryStatCard
LatestReflectionCard
SectionHeader
ControlFactorCard
StatusBadge
BlockerAnalysisCard
DiagnosisCard
InsightColumn
PracticalPlanCard
ActionChecklist
AvoidList
PrimaryButton
SecondaryButton
IconBadge
```

---

# 16. Recommended Page Structure

Use this structure for the dashboard page:

```tsx
<AppShell>
  <SidebarNav />

  <main>
    <DashboardHeader />

    <section>
      <SummaryStatCard />
      <SummaryStatCard />
      <SummaryStatCard />
      <SummaryStatCard />
    </section>

    <LatestReflectionCard />

    <section>
      <SectionHeader />
      <ControlFactorCard />
      <ControlFactorCard />
      <ControlFactorCard />
      <ControlFactorCard />
    </section>

    <section>
      <SectionHeader />
      <BlockerAnalysisCard />
      <BlockerAnalysisCard />
      <BlockerAnalysisCard />
    </section>

    <DiagnosisCard />

    <PracticalPlanCard />
  </main>
</AppShell>
```

---

# 17. Tailwind Design Tokens

If using Tailwind CSS, extend the theme with these values.

```ts
theme: {
  extend: {
    colors: {
      background: "#FAFBF8",
      surface: "#FFFFFF",
      "surface-soft": "#F6F8F3",

      primary: {
        50: "#F2F9ED",
        100: "#E3F3D9",
        200: "#C8E9B8",
        300: "#A6DB8E",
        400: "#7CC85C",
        500: "#4EA72E",
        600: "#3B8E20",
        700: "#2F721C",
        800: "#285A1B",
        900: "#214A19",
      },

      border: "#E4E8DF",
      "border-strong": "#D4DACD",

      text: {
        primary: "#111827",
        secondary: "#5F6B5A",
        muted: "#7C8578",
        soft: "#9AA392",
      },

      success: {
        bg: "#EEF8E8",
        text: "#2F721C",
        border: "#BFE3AE",
      },

      warning: {
        bg: "#FFF7E8",
        text: "#B66A00",
        border: "#F4D39A",
      },

      danger: {
        bg: "#FFF1F0",
        text: "#C0392B",
        border: "#F0B5AE",
      },

      info: {
        bg: "#EFF5FF",
        text: "#315EBD",
        border: "#B8CCF5",
      },
    },

    borderRadius: {
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "20px",
      "2xl": "24px",
    },

    boxShadow: {
      soft: "0 8px 24px rgba(17, 24, 39, 0.06)",
      card: "0 8px 24px rgba(17, 24, 39, 0.04)",
      elevated: "0 16px 40px rgba(17, 24, 39, 0.08)",
    },
  },
}
```

---

# 18. Example Utility Classes

## Page Background

```tsx
<div className="min-h-screen bg-background text-text-primary">
```

## Main Card

```tsx
<div className="rounded-xl border border-border bg-surface p-6 shadow-card">
```

## Section Card

```tsx
<section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
```

## Green Highlight Card

```tsx
<div className="rounded-2xl border border-success-border bg-success-bg p-6">
```

## Primary Button

```tsx
<button className="rounded-md bg-primary-600 px-4 py-2 font-semibold text-white shadow-soft transition hover:bg-primary-700">
```

## Secondary Button

```tsx
<button className="rounded-md border border-border bg-surface px-4 py-2 font-semibold text-text-primary transition hover:bg-surface-soft">
```

## Status Badge

```tsx
<span className="inline-flex items-center gap-2 rounded-full border border-success-border bg-success-bg px-3 py-1 text-sm font-semibold text-success-text">
```

---

# 19. AI Agent UI Generation Rules

When generating UI for this project, AI agents must follow these rules:

1. Always use the calm green productivity theme.
2. Always prioritize clarity and reflection over decoration.
3. Always use rounded cards with soft borders.
4. Always write supportive, non-judgmental copy.
5. Always separate analysis from action.
6. Always make next steps highly visible.
7. Always show whether blockers are controllable, partly influenced, or outside user control.
8. Always use badges for classification and impact.
9. Always keep the layout breathable.
10. Always make the AI diagnosis feel encouraging.
11. Never create dark, aggressive, neon, or overly corporate UI.
12. Never use harsh productivity-shaming language.
13. Never overload the dashboard with charts.
14. Never hide the next practical plan.
15. Never make the app feel like a task manager only; it is a reflection coach.

---

# 20. Design Quality Checklist

Before finalizing any UI, check:

- Is the page calm and readable?
- Is the main action obvious?
- Does the dashboard explain the user’s productivity pattern?
- Are controllable and uncontrollable factors visually clear?
- Is the diagnosis supportive instead of judgmental?
- Does the user know exactly what to do tomorrow?
- Are cards consistently styled?
- Are badges consistent?
- Is spacing generous?
- Is the color usage restrained?
- Does the UI feel like a premium AI coaching product?

---

# 21. Final Design Direction

The AI Self-Reflection Coach should feel like a personal productivity mirror.

It should help users think:

```txt
Now I understand what happened.
I know what was within my control.
I have a small practical plan for tomorrow.
I do not need to feel judged.
I can improve with small steps.
```

Every screen should support this feeling.
