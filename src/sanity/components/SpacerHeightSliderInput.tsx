import { Stack, Text } from '@sanity/ui'
import type { NumberInputProps } from 'sanity'
import { set } from 'sanity'

const MIN = 0
const MAX = 6
const STEP = 1

export default function SpacerHeightSliderInput(props: NumberInputProps) {
  const { value, onChange, readOnly } = props
  const sliderValue = typeof value === 'number' ? value : 6

  return (
    <Stack space={2}>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={sliderValue}
        onChange={(event) => onChange(set(Number(event.currentTarget.value)))}
        disabled={readOnly}
        aria-label="Spacer height"
        style={{ width: '100%' }}
      />
      <Text size={1} muted>
        Spacer height: {sliderValue}
      </Text>
    </Stack>
  )
}
