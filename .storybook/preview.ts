import type { Preview } from '@storybook/react'
import '../src/tokens/belloa.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'Belloa dark',
      values: [
        { name: 'Belloa dark',    value: '#101211' },
        { name: 'Belloa layer-1', value: '#171918' },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
}

export default preview
