import type { Preview } from '@storybook/react'
import { InitializeOptions, initialize, mswLoader } from 'msw-storybook-addon'
import { MercoaSession } from '../src/components/Mercoa'
import { mockToken, mswHandlers } from '../src/stories/mockData'

import '../src/tailwind.base.css'
import '../src/tailwind.css'

let options: InitializeOptions = {
  onUnhandledRequest: 'bypass',
}
if (location.hostname === 'mercoa-finance.github.io') {
  options = {
    ...options,
    serviceWorker: {
      url: '/react/mockServiceWorker.js',
    },
  }
}
initialize(options, mswHandlers)

const preview: Preview = {
  parameters: {
    options: {
      sortStory: {
        order: ['Portal', 'Invoice Inbox', 'Invoice', 'Entity', 'Payment Methods', 'Vendors', 'Approvals', 'Utility'],
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