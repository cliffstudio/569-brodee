# Next.js + Sanity CMS Starter

A modern, clean starter template for building content-driven websites with Next.js 15 and Sanity CMS.

## Features

- ⚡️ **Next.js 15** with App Router
- 🎨 **Sanity CMS** for content management
- 📝 **TypeScript** for type safety
- 🔧 **Flexible Schema** with modular sections
- 📦 **Sanity Studio** embedded at `/studio`

## Getting Started

### 1. Prerequisites

- Node.js 20+ installed (Node 22 LTS or 24 LTS recommended to avoid dependency engine warnings; Node 23 is not in most packages’ support matrix)
- A Sanity account (free at [sanity.io](https://www.sanity.io))

### 2. Create a Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Create a new project
3. Note your **Project ID** and **Dataset** name (usually `production`)

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Copy the example environment file and add your Sanity credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Sanity project details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 5. Run Development Server

```bash
npm run dev
```

Your app will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

### 6. Create Your First Page

1. Visit [http://localhost:3000/studio](http://localhost:3000/studio)
2. Create a new **Page**
3. Set the slug to `home`
4. Add some sections (Hero Section, Text Section, etc.)
5. Publish the page
6. Visit [http://localhost:3000](http://localhost:3000) to see your page

## Project Structure

```
nextjs-sanity-starter/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [...slug]/         # Dynamic page routes
│   │   ├── studio/            # Sanity Studio route
│   │   ├── components/        # React components
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   └── sanity/                # Sanity configuration
│       ├── schemaTypes/       # Content schemas
│       │   ├── objects/       # Reusable objects
│       │   └── sections/      # Page sections
│       ├── lib/               # Queries
│       └── utils/             # Utilities
├── sanity.config.ts           # Sanity Studio config
├── sanity.client.ts           # Sanity client
└── package.json
```

## Schema Structure

### Page Type

Pages are the main content type. Each page can have:
- **Title**: Page title
- **Slug**: URL path
- **Sections**: Array of content sections

### Section Types

#### Hero Section
- Heading
- Subheading
- Image
- Call-to-action button

#### Text Section
- Heading
- Rich text content

### Adding New Sections

1. Create a new section type in `src/sanity/schemaTypes/sections/`
2. Import and add it to `src/sanity/schemaTypes/index.ts`
3. Create a corresponding React component in `src/app/components/`
4. Add the component to `PageRenderer.tsx`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typegen` - Generate TypeScript types from Sanity schemas

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

### Deploy Sanity Studio

The Sanity Studio is automatically deployed with your Next.js app at `/studio`.

Alternatively, you can deploy it separately:

```bash
npm run build
```

Then configure CORS origins in your [Sanity project settings](https://www.sanity.io/manage).

## Customization

### Styling

Add or customize global styles in `src/app/globals.css`.

### Content Schema

Edit schema types in `src/sanity/schemaTypes/` to match your content needs.

### Components

All React components are in `src/app/components/`. Modify them to match your design requirements.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
## Support

For issues and questions:
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Sanity Community](https://www.sanity.io/community)

## License

MIT

