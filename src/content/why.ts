import type { CostRow, Persona } from './widgets'

/**
 * Content for the /why page: who is afraid of what when architecture comes up,
 * and what production teaches you versus what a kata teaches you.
 */
export const personas: Persona[] = [
  {
    id: 'junior',
    label: 'Junior developer',
    fear: 'If I design it wrong, the company pays for it for years.',
    gains: [
      'A safe place to draw a whole system and be wrong',
      'Feedback from seniors within the hour, not after go-live',
      'The vocabulary to follow, and join, a design discussion',
      'Proof that a system context fits on one sheet of paper',
    ],
    afterPractice: 'Sketches a C1 before touching a ticket and speaks up when the design is discussed.',
  },
  {
    id: 'medior',
    label: 'Medior developer',
    fear: 'I can build almost anything, but I cannot explain why one design is better than another.',
    gains: [
      'Practice at defending a choice with trade-offs instead of taste',
      'Exposure to styles you have never worked in',
      'The habit of asking the customer before drawing',
      'A view of the whole system instead of your own service',
    ],
    afterPractice: 'Refines tickets with a container sketch and names the characteristic the change touches.',
  },
  {
    id: 'senior',
    label: 'Senior developer',
    fear: 'Being exposed as someone who has only ever built it one way.',
    gains: [
      'Coaching without owning every decision',
      'Fresh designs from people who do not share your assumptions',
      'A sharper view of your own trade-offs, because you had to say them out loud',
      'A team that can carry a design while you are on holiday',
    ],
    afterPractice: 'Leads the feedback round and lets the group reach a design they can defend themselves.',
  },
  {
    id: 'architect',
    label: 'Architect',
    fear: 'Becoming the bottleneck everyone waits for.',
    gains: [
      'Twenty people who read the same diagram the same way',
      'Reviews that start at C2 instead of at a blank page',
      'Early signals about where the teams lack knowledge',
      'Decisions that get questioned in the kata, not in production',
    ],
    afterPractice: 'Reviews and steers instead of drawing every box, and the queue at the door gets shorter.',
  },
  {
    id: 'organisation',
    label: 'The organisation',
    fear: 'Architecture lives in three heads, and one of them is looking for a new job.',
    gains: [
      'Small changes get architected in minutes, not in a meeting next week',
      'Onboarding starts with a picture everyone can explain',
      'Cheap, repeatable practice instead of expensive lessons in production',
      'The bus factor for design goes from three to the whole team',
    ],
    afterPractice: 'Design knowledge is spread across teams and written down in a language everyone shares.',
  },
]

export const costRows: CostRow[] = [
  {
    aspect: 'Time until you learn you were wrong',
    production: 'months, sometimes years',
    kata: 'eight minutes, in the feedback round',
  },
  {
    aspect: 'Cost of being wrong',
    production: 'a rewrite, a budget, sometimes a career',
    kata: 'a fresh sheet of paper',
  },
  {
    aspect: 'Who gets to try',
    production: 'the architect, and maybe one senior',
    kata: 'everyone at the table',
  },
  {
    aspect: 'Blast radius',
    production: 'customers, teams, the roadmap',
    kata: 'one table and a marker',
  },
  {
    aspect: 'Number of attempts per year',
    production: 'one, if a new system starts at all',
    kata: 'twelve, one a month, more if you like',
  },
  {
    aspect: 'What you take home',
    production: 'a system you live with for a decade',
    kata: 'a photo of the sheet and a sharper eye',
  },
]

export const newardQuote = {
  text: 'So how are we supposed to get great architects, if they only get the chance to architect fewer than a half-dozen times in their career?',
  by: 'Ted Neward, Architectural Katas',
}
