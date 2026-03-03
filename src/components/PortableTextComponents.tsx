import type { PortableTextComponents } from '@portabletext/react'

type LinkMarkValue = {
  href?: string
  openInNewTab?: boolean
}

export const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const { href = '', openInNewTab } = (value ?? {}) as LinkMarkValue
      if (openInNewTab) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        )
      }
      return <a href={href}>{children}</a>
    },
  },
}
