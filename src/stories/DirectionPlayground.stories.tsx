import type { Meta, StoryObj } from '@storybook/react';
import { DirectionPlayground } from '../components/demo/direction-playground';

const meta: Meta<typeof DirectionPlayground> = {
  title: 'Demo/DirectionPlayground',
  component: DirectionPlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive playground demonstrating RTL/LTR support in a canvas-like drawing interface with Arabic/English content.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DirectionPlayground>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Full canvas interface with Arabic content, demonstrating RTL layout, logical properties, and directional icons.',
      },
    },
  },
};

export const LayoutTest: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Focus on testing layout stability when switching directions. Canvas connectors and node positioning should remain intact.',
      },
    },
  },
};

export const IconDirectionTest: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Specifically tests how icons flip and directional elements behave during language/direction switches.',
      },
    },
  },
};