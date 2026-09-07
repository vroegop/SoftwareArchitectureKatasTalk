import type { CustomerQuestion } from '../widgets'

/** Clarifying questions groups ask the "customer"; the facilitator answers from this list. */
export const customerQuestions: CustomerQuestion[] = [
  {
    q: 'How many container moves per hour at peak, and how bursty is it?',
    a: 'About 400 moves an hour when two large vessels are alongside, roughly three times the quiet-night rate. Vessel arrivals are known days ahead, so the bursts are predictable.',
  },
  {
    q: 'May the planning system be down while the equipment keeps moving?',
    a: 'Yes. Planning may be unavailable for up to an hour as long as dispatched jobs keep executing. The reverse is not acceptable: the control side must never stop while the yard is in motion.',
  },
  {
    q: 'How fast must a dispatch decision be?',
    a: 'Sub-second from a job becoming ready to the command reaching the machine. A crane waiting for a decision costs money every second; a wrong decision costs far more.',
  },
  {
    q: 'What happens when the network to an AGV drops?',
    a: 'The vehicle stops inside its safety envelope and waits. The terminal must keep working around it, and traffic must re-route without a human.',
  },
  {
    q: 'Who owns the PLC protocol specifications of the three vendors?',
    a: 'The vendors do. We have signed interface agreements, but each protocol is different and the fourth vendor will bring another one. Expect to write an adapter per vendor.',
  },
  {
    q: 'Must the emulator run the real software?',
    a: 'Yes. Certification and acceptance tests run the exact production build against the emulated terminal. Anything that only works in production is not accepted.',
  },
  {
    q: 'How long must audit data be kept, and who reads it?',
    a: 'Every container move for seven years, readable by customs, insurers and the terminal itself. Telemetry is kept for a year for maintenance analysis.',
  },
  {
    q: 'Is selling the software to other terminals a real plan or an ambition?',
    a: 'A real plan with a budget line, but the first terminal comes first. Assume other terminals will have different equipment vendors and different gate processes.',
  },
  {
    q: 'What is the budget and the deadline?',
    a: 'Eighteen months to go-live with a large but not unlimited budget. Missing the vessel schedule at go-live is not an option, so a smaller scope on time beats a complete scope late.',
  },
  {
    q: 'What must never happen?',
    a: 'Two machines on a collision course, a container leaving the gate with a customs hold, and the yard standing still because of a software deployment.',
  },
]
