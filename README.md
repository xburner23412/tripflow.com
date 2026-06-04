<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3351d497-02d6-43f8-b23c-41350865bd4d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase cloud login and sync

TripFlow uses Supabase for real email authentication and cloud-synced trip data.

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase.sql`.
3. In Supabase, copy the Project URL and anon public key from Project Settings -> API.
4. In Vercel, open Project Settings -> Environment Variables and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Redeploy the Vercel project.

Each authenticated user gets their own private `trip_profiles` row. Row level security keeps users from reading or writing another user's trip data.
