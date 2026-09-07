import type { CharacteristicExample } from './widgets'

/**
 * Content for the /characteristics page beyond the eleven rated ones: example
 * characteristics per group and the rules for picking the driving ones.
 */
export const characteristicExamples: CharacteristicExample[] = [
  {
    group: 'operational',
    examples: [
      'Availability',
      'Continuity',
      'Performance',
      'Recoverability',
      'Reliability',
      'Robustness',
      'Scalability',
      'Elasticity',
    ],
  },
  {
    group: 'structural',
    examples: [
      'Configurability',
      'Extensibility',
      'Installability',
      'Reuse',
      'Localisation',
      'Maintainability',
      'Portability',
      'Upgradeability',
    ],
  },
  {
    group: 'cross-cutting',
    examples: [
      'Accessibility',
      'Archivability',
      'Authentication',
      'Authorisation',
      'Legal',
      'Privacy',
      'Security',
      'Usability',
    ],
  },
]

export const characteristicRules: string[] = [
  'Explicit characteristics come from the requirements; implicit ones come from the domain and are just as real.',
  'Never more than seven. Everything is a characteristic to somebody; pick the ones that would change the design.',
  'The top three drive the decision; the rest are constraints you check the design against.',
  'There is no best architecture, only the least worst for these characteristics in this context.',
  'Write the why down, in an ADR, before you forget which trade-off you made.',
]
