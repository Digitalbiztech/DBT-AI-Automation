export const STATE_MAP: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia', 'PR': 'Puerto Rico'
};

export const STATE_CODE_MAP: Record<string, string> = Object.entries(STATE_MAP).reduce((acc, [code, name]) => {
  acc[name.toLowerCase()] = code;
  return acc;
}, {} as Record<string, string>);

export const getStateCode = (s: string) => {
  if (!s) return "";
  const trimmed = s.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return STATE_CODE_MAP[trimmed.toLowerCase()] || trimmed;
};

export const normalizeState = (s: string) => {
  if (!s) return "";
  const trimmed = s.trim();
  if (trimmed.length === 2) return STATE_MAP[trimmed.toUpperCase()] || trimmed;
  return trimmed;
};

export const matchesState = (rowState: string, selectedStates: string[]) => {
  if (!selectedStates || selectedStates.length === 0) return true;
  const rowNorm = normalizeState(rowState);
  const selectedNorms = selectedStates.map(normalizeState);
  return selectedNorms.includes(rowNorm);
};
