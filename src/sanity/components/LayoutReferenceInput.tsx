import { Card, Stack, Text } from '@sanity/ui'
import type { StringInputProps } from 'sanity'
import type { ComponentType } from 'react'

const DEFAULT_REFERENCE_IMAGE_PATH = '/layout-references/intro-with-media.jpg'
const DEFAULT_REFERENCE_ALT = 'Section layout reference'
const DEFAULT_HELP_TEXT = 'Visual reference only. This image is not rendered on the website.'

type LayoutReferenceConfig = {
  imagePath?: string
  alt?: string
  helpText?: string
}

export function createLayoutReferenceInput(
  config?: LayoutReferenceConfig,
): ComponentType<StringInputProps> {
  const imagePath = config?.imagePath ?? DEFAULT_REFERENCE_IMAGE_PATH
  const imageAlt = config?.alt ?? DEFAULT_REFERENCE_ALT
  const helpText = config?.helpText ?? DEFAULT_HELP_TEXT

  return function LayoutReferenceInput() {
    return (
      <Stack space={3}>
        <Card border radius={2} padding={2}>
          <img
            src={imagePath}
            alt={imageAlt}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6 }}
          />
        </Card>
        <Text size={1} muted>
          {helpText}
        </Text>
      </Stack>
    )
  }
}
