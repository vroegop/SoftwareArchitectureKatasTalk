import type { Kata } from '../types'

/** The custom running example of the talk: a fictional automated container terminal. */
export const westhavenKata: Kata = {
  id: 'westhaven',
  title: 'Westhaven Automated Terminal',
  sourceUrl: 'https://vroegop.github.io/SoftwareArchitectureKatasTalk/case',
  sourceName: 'Custom kata for this talk',
  author: 'Randy Vroegop',
  summary:
    'A terminal operator is building a new automated container terminal and needs the software that plans, dispatches and controls it, from a vessel stowage plan arriving to a truck leaving the gate with the right container. Automated stacking cranes, automated guided vehicles and remote-controlled quay cranes move about 1.5 million containers a year with nobody in the yard.',
  users:
    'About 40 planners and control-room operators per shift, 150 maintenance and operations staff, thousands of truck drivers a day at the gate, dozens of shipping lines and hauliers over EDI and APIs, customs and the port community system',
  requirements: [
    'Import vessel stowage plans (BAPLIE over EDI) and produce a discharge and load plan per vessel call',
    'Plan yard positions and dispatch jobs in real time to automated stacking cranes, automated guided vehicles and quay cranes',
    'Let remote operators in the control room take over the moves the automation cannot finish, such as the final landing on a truck chassis',
    'Run a truck gate with OCR and RFID identification and validate truck appointments before a container is released',
    'Handle rail and barge moves next to the vessel and truck flows',
    'Keep the terminal operating when a crane, a vehicle or a network segment fails',
    'Enforce safety zones at all times, so that no two machines can be sent on a collision course',
    'Collect equipment telemetry for maintenance and keep an audit trail for every container move',
    'Block any move on a container with a customs hold and export completed moves to the ERP for billing',
  ],
  additionalContext: [
    'The terminal runs 24/7; an hour of downtime costs six figures and a delayed vessel far more',
    'Equipment comes from three vendors with different PLC protocols (OPC UA and proprietary); a fourth vendor is being negotiated',
    'The operator wants to sell the software to other terminals once it works',
    'Safety certification requires that no software change can put two machines on a collision course',
    'An emulator (digital twin) of the terminal is used to test before go-live and must run the exact production software',
  ],
  tags: ['real-time', 'safety', 'integration', 'availability', 'custom'],
  difficulty: 'advanced',
  goodFor: [
    'Forces a conversation about quanta: planning and real-time control have different availability needs',
    'Rich enough to show C1, C2 and C3 on the same system without inventing detail',
    'Safety as a cross-cutting constraint that no star rating captures',
  ],
  facilitatorHints: [
    'Likely drivers: availability, fault tolerance, performance; then extensibility for the vendor plug-ins and testability through the emulator',
    'Classic trap: one big system with one database, so a slow billing report can stall the cranes',
    'Be ready for the question "may planning be down while control keeps running?" and answer yes, for up to an hour',
    'Groups that finish early: add a fourth vendor with a new protocol, or a customs system that goes offline for a day',
  ],
}
