import type { StoryblokRichTextNode } from '@storyblok/richtext'

export type FeatureCardIcon = 'code' | 'palette' | 'rocket' | 'heart'
export type FeatureCardColor = 'primary' | 'yellow' | 'lavender'

export interface FeatureCard {
  _uid: string
  title: string
  description: string
  icon: FeatureCardIcon
  color?: FeatureCardColor
}

export interface AboutContent {
  bio: StoryblokRichTextNode<unknown>
  features: FeatureCard[]
}
