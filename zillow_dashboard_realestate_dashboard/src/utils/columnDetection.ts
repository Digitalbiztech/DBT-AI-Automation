/**
 * Shared utility for detecting column roles in Zillow CSVs.
 */
export interface RegionColumns {
  region: string;
  state: string;
  city: string;
  zip: string;
}

export function detectRegionColumns(headers: string[]): RegionColumns {
  const lower = headers.map((h) => h.toLowerCase());
  return {
    region: headers[lower.findIndex((h) => 
      h.includes("regionname") || 
      h.includes("region") || 
      h === "name" || 
      h === "region"
    )] || headers[0],
    state: headers[lower.findIndex((h) => 
      h.includes("statename") || 
      h.includes("state") || 
      h === "st" || 
      h === "statecode" || 
      h === "state name"
    )] || "",
    city: headers[lower.findIndex((h) => 
      h.includes("city") || 
      h.includes("metro") || 
      h.includes("cbsa")
    )] || "",
    zip: headers[lower.findIndex((h) => 
      h.includes("zip") || 
      h.includes("postal") || 
      h === "regionid"
    )] || "",
  };
}
