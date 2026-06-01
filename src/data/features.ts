export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: 'PL',
    title: 'Scoped planning',
    description: 'Break each request into a clear implementation path before changing code.',
  },
  {
    icon: 'DV',
    title: 'Focused development',
    description: 'Make targeted code changes that stay inside the current issue and project conventions.',
  },
  {
    icon: 'QA',
    title: 'Build validation',
    description: 'Run the relevant checks after each change and use failures to drive fixes.',
  },
  {
    icon: 'PR',
    title: 'Pull request flow',
    description: 'Package completed work into a branch, PR, merge, and issue closure workflow.',
  },
  {
    icon: 'UI',
    title: 'Interface polish',
    description: 'Apply the existing design tokens so each section feels consistent and usable.',
  },
  {
    icon: 'CFG',
    title: 'Config discipline',
    description: 'Keep environment values configurable and avoid hardcoded deployment assumptions.',
  },
];
