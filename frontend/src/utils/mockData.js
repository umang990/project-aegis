export const MOCK_ATTACKS = [
  {
    id: 1,
    type: 'Social Engineering',
    status: 'Failed',
    target: 'HR Bot',
    time: '2 mins ago'
  },
  {
    id: 2,
    type: 'Prompt Injection',
    status: 'Success',
    target: 'HR Bot',
    time: '5 mins ago'
  },
  {
    id: 3,
    type: 'RAG Poisoning',
    status: 'Failed',
    target: 'Finance Bot',
    time: '12 mins ago'
  },
  {
    id: 4,
    type: 'Tool Hijack',
    status: 'Success',
    target: 'Medical Assistant',
    time: '1 hr ago'
  }
];

export const MOCK_STATS = {
  activeAgents: 5,
  vulnerabilitiesFound: 12,
  patchesApplied: 9,
  systemHealth: '87%'
};

export const MOCK_TRACES = [
  { id: 'T-001', type: 'Prompt Injection', severity: 'Critical', success: true },
  { id: 'T-002', type: 'Data Exfiltration', severity: 'High', success: false },
  { id: 'T-003', type: 'Tool Hijacking', severity: 'Medium', success: true },
  { id: 'T-004', type: 'Social Engineering', severity: 'Low', success: false }
];
