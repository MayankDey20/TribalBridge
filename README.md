# TribalBridge

AI-powered tribal language translation platform built with React, TypeScript, and Supabase.

## Features

- 🌍 **15+ Tribal Languages** - Gondi, Santali, Ho, Bodo, and more
- 🤖 **AI Translation** - Powered by Ollama, OpenAI, and Google Translate
- 🎤 **Voice Translation** - Speech-to-text and text-to-speech
- 📄 **Document Upload** - Translate entire documents
- 📊 **Analytics Dashboard** - Track your translation stats
- 🔒 **Secure Authentication** - Supabase auth with Google OAuth
- 📱 **Fully Responsive** - Works on all devices

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI Services:** Ollama, OpenAI, Google Translate
- **Deployment:** Netlify

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/MayankDey20/TribalBridge.git
cd TribalBridge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the Supabase migration:
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Run the SQL from `supabase/complete-database-setup.sql`

6. Start the development server:
```bash
npm run dev
```

7. Open http://localhost:5173

## Deployment to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. Push your code to GitHub (already done ✅)
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (Optional) `VITE_OPENAI_API_KEY`
   - (Optional) `VITE_GOOGLE_TRANSLATE_API_KEY`
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Environment Variables

Required for production:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional (for enhanced translation):
- `VITE_OPENAI_API_KEY` - OpenAI API key
- `VITE_GOOGLE_TRANSLATE_API_KEY` - Google Translate API key

## Database Setup

The complete database schema is in `supabase/complete-database-setup.sql`. It includes:
- User profiles
- 18 tribal languages
- Translation storage
- RLS policies
- Auto email confirmation
- All necessary indexes

## Features Overview

### Translation
- Text, audio, and document translation
- 200+ word dictionary for common phrases
- AI fallback for complex translations
- Confidence scoring

### Dashboard
- Translation statistics
- Recent translation history
- Performance metrics
- Monthly goals and progress

### Profile
- User profile management
- Password change
- Data export (JSON)
- Translation history

### Analytics
- Detailed translation metrics
- Language usage statistics
- Accuracy tracking
- Speed comparisons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Author

Mayank Dey
- GitHub: [@MayankDey20](https://github.com/MayankDey20)

## Acknowledgments

Built with respect for indigenous cultures and language preservation efforts worldwide.
