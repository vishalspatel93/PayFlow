export type ParticipantType =
  | 'customer'
  | 'merchant'
  | 'gateway'
  | 'processor'
  | 'network'
  | 'issuer'
  | 'acquirer'
  | 'settlement'
  | 'regulator'

export interface Participant {
  id: string
  name: string
  type: ParticipantType
  description: string
}

export interface LatencyRange {
  min: number
  typical: number
  max: number
}

export interface FeeComponent {
  label: string
  description: string
}

export interface FlowStep {
  id: string
  from: string
  to: string
  name: string
  description: string
  latencyMs: LatencyRange
  dataTransmitted: string[]
  feeAccrued: FeeComponent | null
}

export interface FailureScenario {
  id: string
  name: string
  triggerStep: string
  declineCode: string
  description: string
  recommendation: string
}

export interface FeeStructure {
  headline: string
  notes: string
}

export interface PaymentMethod {
  id: string
  name: string
  tagline: string
  participants: Participant[]
  steps: FlowStep[]
  failureScenarios: FailureScenario[]
  feeStructure: FeeStructure
  settlementTiming: string
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'card_visa_mc',
    name: 'Credit Card (Visa/MC)',
    tagline: 'Classic 4-party model with percentage-based interchange.',
    participants: [
      {
        id: 'customer',
        name: 'Customer',
        type: 'customer',
        description: 'Cardholder initiating the purchase.',
      },
      {
        id: 'merchant',
        name: 'Merchant',
        type: 'merchant',
        description: 'Business accepting the card payment.',
      },
      {
        id: 'gateway',
        name: 'Payment Gateway',
        type: 'gateway',
        description: 'Front-door API that normalizes the integration.',
      },
      {
        id: 'processor',
        name: 'Payment Processor',
        type: 'processor',
        description: 'Routes transactions to networks and acquiring banks.',
      },
      {
        id: 'network',
        name: 'Card Network (Visa/MC)',
        type: 'network',
        description: 'Runs the network rails and enforces scheme rules.',
      },
      {
        id: 'issuer',
        name: 'Issuing Bank',
        type: 'issuer',
        description: 'Bank that issued the customer’s card.',
      },
      {
        id: 'acquirer',
        name: 'Acquiring Bank',
        type: 'acquirer',
        description: 'Merchant’s bank that receives the funds.',
      },
      {
        id: 'settlement',
        name: 'Settlement System',
        type: 'settlement',
        description: 'Clearing and settlement between issuer, network, acquirer.',
      },
    ],
    steps: [
      {
        id: 'auth_request',
        from: 'customer',
        to: 'gateway',
        name: 'Authorization request',
        description: 'Customer submits card details and passes 3DS/device checks.',
        latencyMs: { min: 200, typical: 400, max: 1200 },
        dataTransmitted: ['PAN (tokenized where possible)', 'Amount', 'Merchant', 'Device / risk signals'],
        feeAccrued: null,
      },
      {
        id: 'gateway_to_processor',
        from: 'gateway',
        to: 'processor',
        name: 'Gateway forwards to processor',
        description: 'Gateway normalizes the request and forwards it to the configured processor.',
        latencyMs: { min: 20, typical: 80, max: 200 },
        dataTransmitted: ['Normalized auth request', 'Gateway routing metadata'],
        feeAccrued: {
          label: 'Gateway fee',
          description: 'Per-transaction or bundled fee for gateway services.',
        },
      },
      {
        id: 'processor_to_network',
        from: 'processor',
        to: 'network',
        name: 'Processor routes to network',
        description: 'Processor chooses the right network and formats the auth message.',
        latencyMs: { min: 20, typical: 60, max: 200 },
        dataTransmitted: ['ISO 8583-style auth message', 'Risk & routing hints'],
        feeAccrued: null,
      },
      {
        id: 'network_to_issuer',
        from: 'network',
        to: 'issuer',
        name: 'Network -> Issuer',
        description: 'Network forwards the authorization to the issuing bank.',
        latencyMs: { min: 50, typical: 150, max: 500 },
        dataTransmitted: ['Card & account data', 'Merchant category', 'Amount, currency'],
        feeAccrued: {
          label: 'Interchange & assessments',
          description:
            'Issuer and network earn percentage-based fees for approving the transaction.',
        },
      },
    ],
    failureScenarios: [
      {
        id: 'insufficient_funds',
        name: 'Insufficient funds',
        triggerStep: 'network_to_issuer',
        declineCode: '51',
        description:
          'Issuer declines the authorization because the available balance or credit is too low.',
        recommendation:
          'Return a clear message to the customer and avoid aggressive retries.',
      },
      {
        id: 'fraud_decline',
        name: 'Fraud/risk decline',
        triggerStep: 'network_to_issuer',
        declineCode: '05',
        description:
          'Issuer’s risk engine flags the transaction as suspicious and declines it.',
        recommendation:
          'Offer alternative payment methods and consider additional verification (3DS, OTP).',
      },
    ],
    feeStructure: {
      headline: 'Typical card fees: ~2–3% + fixed per transaction.',
      notes:
        'Effective rate depends on MCC, region, card type (debit vs credit vs rewards), and risk profile.',
    },
    settlementTiming: 'Authorization in real time; clearing and settlement T+1 to T+3.',
  },
  {
    id: 'ach_debit',
    name: 'ACH Debit',
    tagline: 'Bank-to-bank pull with flat-fee economics and slower settlement.',
    participants: [
      {
        id: 'customer',
        name: 'Customer',
        type: 'customer',
        description: 'Account holder authorizing the debit.',
      },
      {
        id: 'merchant',
        name: 'Merchant',
        type: 'merchant',
        description: 'Business initiating the ACH debit.',
      },
      {
        id: 'gateway',
        name: 'ACH Gateway',
        type: 'gateway',
        description: 'API surface that generates ACH-compliant files or messages.',
      },
      {
        id: 'processor',
        name: 'ODFI',
        type: 'processor',
        description: 'Originating Depository Financial Institution submitting the file.',
      },
      {
        id: 'network',
        name: 'ACH Operator (NACHA / Fed)',
        type: 'network',
        description: 'Clearing house that routes between ODFIs and RDFIs.',
      },
      {
        id: 'settlement',
        name: 'Settlement System',
        type: 'settlement',
        description: 'Interbank settlement for ACH credits and debits.',
      },
    ],
    steps: [
      {
        id: 'ach_authorization',
        from: 'customer',
        to: 'merchant',
        name: 'Mandate authorization',
        description:
          'Customer agrees to ACH debit terms (via micro-deposits, Plaid-style link, or account/routing entry).',
        latencyMs: { min: 0, typical: 0, max: 0 },
        dataTransmitted: ['Account + routing (tokenized where possible)', 'Mandate terms'],
        feeAccrued: null,
      },
      {
        id: 'ach_file_creation',
        from: 'merchant',
        to: 'gateway',
        name: 'ACH file creation',
        description:
          'Merchant or gateway batches debits into an ACH file or real-time message for the ODFI.',
        latencyMs: { min: 60000, typical: 3600000, max: 86400000 },
        dataTransmitted: ['Batch of debit entries', 'Effective entry date'],
        feeAccrued: {
          label: 'Gateway / ODFI fee',
          description:
            'Often a flat fee per file or per item—much cheaper than cards at higher ticket sizes.',
        },
      },
    ],
    failureScenarios: [
      {
        id: 'nsf_return',
        name: 'NSF return (R01)',
        triggerStep: 'ach_file_creation',
        declineCode: 'R01',
        description:
          'Receiving bank rejects the debit because funds are not sufficient at posting time.',
        recommendation:
          'Notify the customer, consider retry windows that respect NACHA rules, and avoid excessive retries.',
      },
    ],
    feeStructure: {
      headline: 'Typical ACH fees: low flat fee per transaction.',
      notes:
        'Best for higher ticket sizes where card percentage fees would be expensive; watch out for return risk.',
    },
    settlementTiming:
      'Same-day or next-day windows depending on submission cutoffs and bank configuration.',
  },
]

