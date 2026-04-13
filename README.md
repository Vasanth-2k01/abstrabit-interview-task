# Smart Bookmark App

Hey there! 👋 Welcome to my submission for the Abstrabit Fullstack Engineer take-home assessment. I had a lot of fun building this project and focusing on making the UI feel extremely premium and responsive.

## What is it?
This is a modern, real-time bookmark manager built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase**. It allows users to securely log in via Google, save links seamlessly, and see all their changes instantly synced across multiple tabs or devices.

## 🚀 Live Demo & Walkthrough
- **Live URL:** [Insert Vercel URL here]
- **Loom Walkthrough:** [Insert Loom URL here]

*(Feel free to sign in with your own Google account to test it out!)*

## 🛠️ Tech Stack & Decisions
- **Framework:** Next.js 14 (App Router) - chosen for its robust server actions and clean API route handling.
- **Styling:** Tailwind CSS - customized with a sleek "glassmorphic" dark theme. I wanted the interface to feel modern, readable, and highly interactive.
- **Database & Auth:** Supabase - powers the Google OAuth flow, the PostgreSQL database, and the real-time websocket connections.
- **UI Components & Icons:** Custom-built React components, skeleton loaders for better UX, and Lucide-React for clean iconography.

---

## 📝 Assessment Requirements Addressed

### 1. Supabase Auth & Row Level Security (RLS)
The app mandates a strict standard where users can only read, insert, update, or delete their *own* private bookmarks. 
I enforced this using Postgres Row Level Security (RLS) policies directly on the `bookmarks` table. The primary policy heavily relies on checking the authenticated user's ID:
`auth.uid() = user_id`

**Why this is the right approach:**
Instead of relying solely on frontend logic or backend application code (which can be accidentally circumvented or have bugs), RLS enforces security at the lowest possible layer—the database itself. Even if someone manages to hit an API endpoint directly or a bug is introduced in a Next.js server action, the database simply refuses to return or mutate rows belonging to another user.

### 2. Real-Time Sync
To achieve that "magic" feeling where adding/editing a bookmark in Tab A makes it update in Tab B instantly without a page refresh, I leveraged Supabase's Realtime subscriptions.

**Implementation details:**
- Inside the client-side `BookmarkGrid` component, I instantiate a Supabase channel listening to the `public` schema's `bookmarks` table.
- We listen specifically for `INSERT`, `UPDATE`, and `DELETE` events.
- When an event fires, the local React state safely updates itself—merging in new bookmarks, splicing out deleted ones, or patching updated details.
- **Subscription Cleanup:** It's critical to call `.unsubscribe()` inside the React `useEffect` cleanup function. If this isn't handled correctly, navigating back and forth across the application creates "zombie" subscriptions in the background, which aggressively eats up memory and forces multiple overlapping state updates for a single database mutation.

### 3. The "Bonus Feature"
For the bonus capability, I implemented **Automatic URL Metadata Extraction** alongside a lightweight **Tagging System**.

**Why?**
A bookmark manager becomes a chore if you are forced to manually type out the title, description, and find an icon every time you want to save a link. To solve this, when a user adds a URL, the application leverages a Node.js Server Action to scrape the destination page. It automatically extracts the `<title>`, description tags, and resolves the favicon. It saves an immense amount of time and makes the dashboard look visually consistent immediately. The tagging system was added because a flat list of bookmarks gets messy quickly—tags provide an intuitive way to categorize content.

### 4. Roadblocks & How I Solved Them
**The Problem:** Handling optimistic UI updates and real-time websocket events gracefully. 
When a user adds a bookmark, I want it to appear on the screen instantly (optimistic UI) so the app feels incredibly snappy. However, milliseconds later, the Supabase real-time subscription would broadcast that exact same `INSERT` event back to the client. This occasionally led to duplicate items rendering briefly before React synced up.

**The Solution:** I refactored the incoming real-time payload handler to intelligently verify local state. Before pushing a new `INSERT` event payload into the grid, the app checks if that record's `id` already exists locally. If it does (meaning we already inserted it optimistically), it gracefully ignores the duplicate event, keeping the UI completely smooth and layout-shift free.

### 5. If I Had More Time...
I would implement **Full-Text Search & Draggable Folders**. Right now, tags help organize things well, but as a personal library grows into the thousands, users need nested folders and a robust fuzzy search (likely integrating Supabase's Postgres full-text search features or an external engine like Algolia) to instantly find the link they are thinking of.

---

## 💻 Running it Locally

1. Clone the repository down to your machine.
2. Run `npm install` to grab the dependencies.
3. Create a `.env.local` file at the root with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run `npm run dev` and open `http://localhost:3000` to start saving your bookmarks!

***

Thanks for taking the time to review my work! I really enjoyed the challenge. Let me know if you have any questions or feedback about the codebase.
