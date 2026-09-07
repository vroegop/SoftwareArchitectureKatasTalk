import type { Law, TradeoffSlider } from './widgets'

/**
 * Content for the /laws page: the laws of software architecture from
 * Fundamentals of Software Architecture, four trade-off sliders and the
 * habits of architectural thinking.
 */
export const laws: Law[] = [
  {
    number: 1,
    text: 'Everything in software architecture is a trade-off.',
    edition: '1st and 2nd edition',
    explanation:
      'If you think you have found something that is not a trade-off, you have not found all the trade-offs yet. A kata makes you say out loud what you gave up.',
  },
  {
    number: 2,
    text: 'Why is more important than how.',
    edition: '1st and 2nd edition',
    explanation:
      'Anyone can read the boxes off a diagram; the reasons behind them are what a team needs to keep making good decisions. Write the why down.',
  },
  {
    number: 3,
    text: 'Most architecture decisions aren’t binary but rather exist on a spectrum between extremes.',
    edition: 'added in the 2nd edition',
    explanation:
      'Monolith or microservices is a false choice. The interesting question is where on the line you sit today, and what would move you.',
  },
]

export const tradeoffSliders: TradeoffSlider[] = [
  {
    id: 'monolith-distributed',
    left: 'Monolith',
    right: 'Distributed',
    leftGains: [
      'Simplicity: one codebase, one deployment, one place to debug',
      'Lower cost to build and to run',
      'Consistent data with plain transactions',
    ],
    rightGains: [
      'Fault isolation: one part fails, the rest keeps running',
      'Independent scaling and deployment per part',
      'Teams can move at their own pace',
    ],
    question: 'Do parts of the system need to fail, scale or deploy independently, or do you just want them to?',
  },
  {
    id: 'sync-async',
    left: 'Synchronous',
    right: 'Asynchronous',
    leftGains: [
      'Easy to reason about: call, wait, answer',
      'Errors surface immediately to the caller',
      'No broker to run or monitor',
    ],
    rightGains: [
      'Responsiveness: the caller does not wait',
      'Decoupling in time: the receiver can be down for a while',
      'Bursts are absorbed by the queue',
    ],
    question: 'Does the caller need the answer now, or does it need to know that the work will happen?',
  },
  {
    id: 'shared-db-per-service',
    left: 'Shared database',
    right: 'Database per service',
    leftGains: [
      'Joins and transactions across everything',
      'One place for reporting',
      'Simple to operate and back up',
    ],
    rightGains: [
      'Clear data ownership',
      'Schema changes stay local',
      'Each store can use the right technology',
    ],
    question: 'Who owns each piece of data, and what happens when two services need to change it together?',
  },
  {
    id: 'buy-build',
    left: 'Buy',
    right: 'Build',
    leftGains: [
      'A faster start on somebody else’s roadmap',
      'Known cost and known limitations',
      'Focus on what makes you different',
    ],
    rightGains: [
      'Fits your domain exactly',
      'You control the pace of change',
      'No vendor lock-in or licence surprises',
    ],
    question: 'Is this the part of the system your business competes on, or the part everyone has?',
  },
]

export const architectThinking: { title: string; detail: string }[] = [
  {
    title: 'Breadth over depth',
    detail: 'Know a bit about many styles and technologies; developers go deep, architects go wide.',
  },
  {
    title: 'Seeing trade-offs',
    detail: 'Every option gives something and costs something; the job is to see both sides before deciding.',
  },
  {
    title: 'Understanding business drivers',
    detail: 'Translate goals like time to market or uptime into characteristics the design has to deliver.',
  },
  {
    title: 'Collaborating with developers',
    detail: 'Stay close to the code and the team; architecture decided alone tends to be ignored.',
  },
]
