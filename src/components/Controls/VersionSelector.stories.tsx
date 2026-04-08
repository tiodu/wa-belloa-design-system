import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VersionSelector } from './VersionSelector'
import type { ControlItem } from './VersionSelector'
import '../../tokens/belloa.css'

/* ---- Meta ---- */

const meta = {
  title: 'Controls/VersionSelector',
  component: VersionSelector,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101211' }],
    },
    docs: {
      description: {
        component:
          'Toolbar with labelled dropdown controls. Used in the SportsbookVisualiser to switch betslip version, brand theme, and locale without leaving the page.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof VersionSelector>

export default meta
type Story = StoryObj<typeof meta>

/* ---- Fixtures ---- */

const BETSLIP_CONTROLS: ControlItem[] = [
  {
    id: 'version',
    label: 'Betslip version',
    value: 'v2',
    options: [
      { value: 'v1', label: 'V1 — Classic' },
      { value: 'v2', label: 'V2 — LiveScoreBet' },
      { value: 'tr', label: 'TR — Turkish' },
      { value: 'float', label: 'Float — Mobile' },
    ],
  },
  {
    id: 'brand',
    label: 'Brand theme',
    value: 'belloa',
    options: [
      { value: 'belloa',     label: 'Belloa (default)' },
      { value: 'betsat',     label: 'Betsat' },
      { value: 'superbetin', label: 'Superbetin' },
      { value: 'turkbet',    label: 'Turkbet' },
    ],
  },
  {
    id: 'locale',
    label: 'Locale',
    value: 'tr',
    options: [
      { value: 'tr', label: '🇹🇷 Turkish' },
      { value: 'en', label: '🇬🇧 English' },
    ],
  },
]

/* ---- Stories ---- */

export const Default: Story = {
  name: 'Default (3 controls)',
  args: {
    controls: BETSLIP_CONTROLS,
    onChange: () => {},
  },
}

export const SingleControl: Story = {
  name: 'Single control',
  args: {
    controls: [BETSLIP_CONTROLS[0]],
    onChange: () => {},
  },
}

export const Interactive: Story = {
  name: 'Interactive — reflects selection',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [controls, setControls] = useState<ControlItem[]>(BETSLIP_CONTROLS)

    function handleChange(id: string, value: string) {
      setControls((prev) =>
        prev.map((c) => (c.id === id ? { ...c, value } : c))
      )
    }

    const current = controls.reduce<Record<string, string>>(
      (acc, c) => ({ ...acc, [c.id]: c.value }),
      {}
    )

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 480 }}>
        <VersionSelector controls={controls} onChange={handleChange} />
        <pre style={{
          background: 'var(--surface-layer-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: '10px 14px',
          fontFamily: 'monospace',
          fontSize: 12,
          color: 'var(--content-secondary)',
          margin: 0,
        }}>
          {JSON.stringify(current, null, 2)}
        </pre>
      </div>
    )
  },
  args: { controls: BETSLIP_CONTROLS, onChange: () => {} },
}
