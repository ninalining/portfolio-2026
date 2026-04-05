import type { StoryblokRichTextNode } from '@storyblok/richtext'
import type { FeatureCard, FeatureCardColor } from '@/types/about'
import type { SkillsSectionContent } from '@/types/skill'

export interface HeroContent {
  badge: string
  title: string
  description: string
}

export interface AccentColorBlock {
  color?: FeatureCardColor
}

export interface HomeFeatureCard extends Omit<FeatureCard, 'color'> {
  color?: FeatureCardColor
  accent?: AccentColorBlock[]
}

export interface HomeAboutContent {
  bio: StoryblokRichTextNode<unknown>
  features: HomeFeatureCard[]
}

export interface HomePageContent {
  hero: HeroContent
  about: HomeAboutContent
  skills?: SkillsSectionContent
}
