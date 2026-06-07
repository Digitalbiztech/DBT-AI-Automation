import { LabReport, ApiResponse, ApiRawBiomarker, Biomarker, BiomarkerStatus, LabPanel } from '@/types/lab';
import { MOCK_REPORT } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Parse a reference_range string like "<200", "3.8-10.8", ">60" into {min, max}
 */
function parseReferenceRange(ref: string): { min: number; max: number } {
  if (!ref) return { min: 0, max: 100 };

  // Standardize all range separators (hyphens, en-dashes, em-dashes, minus signs, tildes, "to") to standard hyphen
  let cleanRef = ref.trim()
    .replace(/\s*(?:[-–—−~]|to|TO|To)\s*/g, '-')
    .replace(/[^0-9.<>≤≥\-.]/g, ''); // strip units and extra characters

  // Handle "< 200" or "<= 200" style
  const ltMatch = cleanRef.match(/[<≤]\s*(\d+\.?\d*)/);
  if (ltMatch) return { min: 0, max: parseFloat(ltMatch[1]) };

  // Handle "> 60" or ">= 60" style
  const gtMatch = cleanRef.match(/[>≥]\s*(\d+\.?\d*)/);
  if (gtMatch) return { min: parseFloat(gtMatch[1]), max: parseFloat(gtMatch[1]) * 2 };

  // Handle "3.8-10.8" style
  const rangeMatch = cleanRef.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
  if (rangeMatch) return { min: parseFloat(rangeMatch[1]), max: parseFloat(rangeMatch[2]) };

  return { min: 0, max: 100 };
}

/**
 * Categorize a biomarker by name into a panel.
 * Normalizes to uppercase before matching to prevent case/punctuation mismatches.
 */
function categorize(name: string): string {
  const n = name.trim().toUpperCase().replace(/[-_]/g, ' ');
  if (['WBC', 'WHITE BLOOD', 'RBC', 'RED BLOOD', 'HEMOGLOBIN', 'HEMATOCRIT', 'PLATELET', 'MCV', 'MCH', 'MCHC', 'RDW', 'NEUTROPHIL', 'LYMPHOCYTE', 'MONOCYTE', 'EOSINOPHIL', 'BASOPHIL', 'HGB', 'HCT', 'PLT'].some(k => n.includes(k)))
    return 'Complete Blood Count (CBC)';
  if (['CHOLESTEROL', 'LDL', 'HDL', 'TRIGLYCERIDE', 'VLDL', 'LIPID'].some(k => n.includes(k)))
    return 'Lipid Panel';
  if (['TSH', 'THYROID', 'FREE T3', 'FREE T4', 'FT3', 'FT4', 'THYROXINE', 'TRIIODO'].some(k => n.includes(k)))
    return 'Thyroid Panel';
  if (['TESTOSTERONE', 'ESTROGEN', 'ESTRADIOL', 'PROGESTERONE', 'DHEA', 'CORTISOL', 'LH', 'FSH', 'PROLACTIN', 'SHBG', 'IGF'].some(k => n.includes(k)))
    return 'Hormones';
  if (['VITAMIN', 'FOLATE', 'B12', 'FERRITIN', 'IRON', 'MAGNESIUM', 'ZINC', 'CALCIUM', 'PHOSPHORUS', 'COPPER'].some(k => n.includes(k)))
    return 'Vitamins & Minerals';
  if (['GLUCOSE', 'BUN', 'CREATININE', 'GFR', 'EGFR', 'SODIUM', 'POTASSIUM', 'CHLORIDE', 'CO2', 'BICARBONATE', 'ALBUMIN', 'PROTEIN', 'BILIRUBIN', 'ALT', 'AST', 'ALP', 'ALKALINE', 'SGOT', 'SGPT'].some(k => n.includes(k)))
    return 'Comprehensive Metabolic Panel (CMP)';
  if (['HBA1C', 'A1C', 'GLYCATED'].some(k => n.includes(k)))
    return 'Comprehensive Metabolic Panel (CMP)';
  return 'Other';
}


function normalizeStatus(s: string): BiomarkerStatus {
  const sl = s?.toLowerCase();
  if (sl === 'normal') return 'normal';
  if (sl === 'high') return 'high';
  if (sl === 'low') return 'low';
  if (sl === 'critical') return 'critical';
  return 'normal';
}

/**
 * Convert API response into our internal LabReport
 */
function mapApiToLabReport(raw: ApiResponse): LabReport {
  const panelMap = new Map<string, Biomarker[]>();

  for (const b of raw.data.biomarkers) {
    const { min, max } = parseReferenceRange(b.reference_range);
    const panel = categorize(b.name);
    const marker: Biomarker = {
      name: b.name,
      value: b.value,
      unit: b.unit,
      min,
      max,
      status: normalizeStatus(b.status),
      category: panel,
      description: b.name,
      insight: b.clinical_interpretation,
      clinicalInterpretation: b.clinical_interpretation,
      detailedAnalysis: b.detailed_analysis,
      confidenceScore: b.confidence_score,
      verified: b.verified,
      hallucinationFlag: b.hallucination_flag,
    };
    if (!panelMap.has(panel)) panelMap.set(panel, []);
    panelMap.get(panel)!.push(marker);
  }

  // Preferred panel order
  const order = [
    'Complete Blood Count (CBC)',
    'Comprehensive Metabolic Panel (CMP)',
    'Lipid Panel',
    'Thyroid Panel',
    'Hormones',
    'Vitamins & Minerals',
    'Other',
  ];

  const panels: LabPanel[] = order
    .filter(name => panelMap.has(name))
    .map(name => ({ name, biomarkers: panelMap.get(name)! }));

  // Add any panels not in the preferred order
  for (const [name, biomarkers] of panelMap) {
    if (!order.includes(name)) panels.push({ name, biomarkers });
  }

  return {
    patientAge: raw.data.patient_info?.age,
    patientGender: raw.data.patient_info?.gender,
    patientWeight: raw.data.patient_info?.weight,
    patientHeight: raw.data.patient_info?.height,
    birthDate: raw.data.patient_info?.birth_date,
    testDate: raw.data.patient_info?.test_date,
    dateAnalyzed: raw.data.patient_info?.date_analyzed,
    testType: raw.data.patient_info?.test_type,
    labName: raw.data.patient_info?.lab_name || 'Unknown',
    collectionDate: raw.header?.collection_date,
    reportDate: raw.header?.report_date,
    labDate: raw.data.patient_info?.test_date || raw.header?.report_date || raw.header?.collection_date,
    specimenNumber: raw.header?.specimen_number,
    summary: raw.data.overall_insights,
    aiInsights: [],
    panels,
    rawApiResponse: raw,
    interpretationSummary: raw.data.interpretation_summary || raw.data.overall_insights,
    testOverviewObservations: raw.data.test_overview_observations,
    possibleHealthStatus: raw.data.possible_health_status,
    payAttention: raw.data.pay_attention,
    panelOverview: raw.data.panel_overview,
    additionalBiomarkers: raw.data.additional_biomarkers,
  };
}

/**
 * Sends a lab PDF to the OCR/AI API and returns a structured LabReport.
 */
export async function parseLabReport(file: File): Promise<LabReport> {
  // ---- MOCK MODE: Remove this block when real API is ready ----
  const USE_MOCK = false; // Set to false when connecting real API
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 2500));
    return MOCK_REPORT;
  }
  // ---- END MOCK MODE ----

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/process`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data: ApiResponse = await response.json();

  if (data.status !== 'success') {
    throw new Error('Analysis failed. Please try again.');
  }

  return mapApiToLabReport(data);
}
