# Flexible Content System

Pages use the **Content Blocks** field (flexible content) so editors can build each page from reusable sections. The homepage is the page with an **empty slug**; About, Works, and Contact are pages with slugs `about`, `works`, and `contact`.

## How to Use

### In Sanity Studio
1. Open **Pages** in the structure, then open or create a page.
2. Set **Slug** (leave empty for the homepage).
3. Scroll to **Content Blocks**.
4. Click **Add item** and choose a block type.
5. Fill in the fields and reorder blocks by dragging.

### In the frontend
Fetch the page with `pageBySlugQuery` (use `slug: ''` for the homepage), then render blocks with `FlexibleContent`. Pass **locale** so blocks can resolve internationalized fields.

```tsx
import { client } from '@/sanity/client'
import { pageBySlugQuery } from '@/sanity/lib/queries'
import FlexibleContent from '@/components/FlexibleContent'

// In your page component (with locale from cookies or context)
const page = await client.fetch(pageBySlugQuery, { slug: '' })
// ...
<FlexibleContent contentBlocks={page.contentBlocks} locale={locale} />
```

## Adding a new content block type

1. **Schema** – `src/sanity/schemaTypes/sections/yourBlock.ts`
2. **Flexible content** – add to the `of` array in `src/sanity/schemaTypes/objects/flexibleContent.ts`
3. **Schema index** – import and add to `schemaTypes` in `src/sanity/schemaTypes/index.ts`
4. **Query** – in `src/sanity/lib/queries.ts` add a `yourBlockFields` variable and include it in `contentBlocksFragment` with a `...select(_type == "yourBlock" => { ... })` branch
5. **Component** – `src/components/sections/YourBlock.tsx` (accept `locale` if the block has i18n fields)
6. **Renderer** – in `src/components/FlexibleContent.tsx`: extend the `ContentBlock` type, then handle the block in the render logic (and in the `contentBlocksList` / media grouping if it affects layout)

### Example: adding a “Call to action” block

**1. Schema** – `src/sanity/schemaTypes/sections/ctaSection.ts`:

```ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ctaSection',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subtext', title: 'Subtext', type: 'text' }),
  ],
  preview: {
    prepare({ heading }) {
      return { title: 'Call to Action', subtitle: heading }
    },
  },
})
```

**2. flexibleContent.ts** – add to `of`:

```ts
{ type: 'ctaSection', title: 'Call to Action' }
```

**3. schemaTypes/index.ts** – import and add to the array:

```ts
import ctaSection from './sections/ctaSection'
// ...
ctaSection,
```

**4. queries.ts** – add fields and wire into `contentBlocksFragment`:

```ts
const ctaSectionFields = groq`heading, subtext`

// In contentBlocksFragment, add:
...select(_type == "ctaSection" => { ${ctaSectionFields} })
```

**5. Component** – `src/components/sections/CtaSection.tsx`:

```tsx
interface CtaSectionProps {
  heading?: string | null
  subtext?: string | null
}

export default function CtaSection({ heading, subtext }: CtaSectionProps) {
  if (!heading && !subtext) return null
  return (
    <section className="cta-section">
      {heading && <h2>{heading}</h2>}
      {subtext && <p>{subtext}</p>}
    </section>
  )
}
```

**6. FlexibleContent.tsx** – add to the `ContentBlock` type and render inside the content section (e.g. in the same loop where you handle `textSection`), for example:

```tsx
// In ContentBlock union type:
| { _type: 'ctaSection'; _key: string; heading?: string | null; subtext?: string | null }

// In the content-section render loop, alongside textSection:
if (block._type === 'ctaSection') {
  return <CtaSection key={block._key} heading={block.heading} subtext={block.subtext} />
}
```

After that, the new block is available in Studio and on the site.
