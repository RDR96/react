import type { Preview } from '@storybook/react'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { MercoaSession } from '../src/components/Mercoa'
import { mockToken, mswHandlers } from '../src/stories/mockData'

import '../src/tailwind.base.css'
import '../src/tailwind.css'

initialize(
  {
    onUnhandledRequest: 'bypass',
  },
  mswHandlers,
)

const preview: Preview = {
  parameters: {
    options: {
      sortStory: {
        order: [
          'Drop-in Portal',
          'Invoice Inbox',
          ['Inbox', 'Invoice Table', 'Metrics'],
          'Invoice',
          'Entity',
          'Payment Methods',
          'Vendors',
          'Approvals',
          'Utility',
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MercoaSession token={mockToken}>
        <Story />
      </MercoaSession>
    ),
  ],
  loaders: [mswLoader],
}

export default preview
