export type BiomarkerStatus = 'normal' | 'high' | 'low' | 'critical' | 'unknown';

export interface Biomarker {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: BiomarkerStatus;
  category: string;
  description?: string;
  insight?: string;
  clinicalInterpretation?: string;
  detailedAnalysis?: string;
  confidenceScore?: number;
  verified?: boolean;
  hallucinationFlag?: boolean;
}

export interface LabPanel {
  name: string;
  biomarkers: Biomarker[];
}

export interface LabReport {
  patientName?: string;
  patientDob?: string;
  patientAge?: number;
  patientGender?: string;
  patientWeight?: string | number;
  patientHeight?: string | number;
  birthDate?: string;
  testDate?: string;
  dateAnalyzed?: string;
  testType?: string;
  labDate?: string;
  labName?: string;
  orderedBy?: string;
  summary?: string;
  panels: LabPanel[];
  aiInsights?: string[];
  collectionDate?: string;
  reportDate?: string;
  specimenNumber?: string;
  rawApiResponse?: any;
  interpretationSummary?: string;
  testOverviewObservations?: { title: string; description: string }[];
  possibleHealthStatus?: { title: string; description: string }[];
  payAttention?: { title: string; description: string }[];
  panelOverview?: string;
  additionalBiomarkers?: { name: string; reason: string }[];
}

// ── New API response types ──
export interface ApiRawBiomarker {
  name: string;
  value: number;
  unit: string;
  reference_range: string;
  status: string;
  clinical_interpretation: string;
  detailed_analysis: string;
  confidence_score?: number;
  verified?: boolean;
  hallucination_flag?: boolean;
}

export interface ApiResponse {
  status: string;
  metadata?: { source?: string };
  header?: {
    patient_id?: string;
    specimen_number?: string;
    accession_number?: string;
    collection_date?: string;
    report_date?: string;
  };
  data: {
    patient_info?: {
      age?: number;
      gender?: string;
      birth_date?: string;
      weight?: string | number;
      height?: string | number;
      test_date?: string;
      date_analyzed?: string;
      test_type?: string;
      lab_name?: string;
    };
    biomarkers: ApiRawBiomarker[];
    overall_insights?: string;
    interpretation_summary?: string;
    test_overview_observations?: { title: string; description: string }[];
    possible_health_status?: { title: string; description: string }[];
    pay_attention?: { title: string; description: string }[];
    panel_overview?: string;
    additional_biomarkers?: { name: string; reason: string }[];
  };
  debug?: { tokens_masked?: number };
}
