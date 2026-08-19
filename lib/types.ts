export type Severity = "Critical" | "High" | "Medium" | "Low";
export type FindingStatus = "Open" | "Fixed";
export type Language = "English" | "Hindi" | "Hinglish";

export type Finding = {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  evidence: string | Record<string, string | number | boolean>;
  owner: Record<Language, string>;
  developer: string;
  effort: "5 min" | "15 min" | "30 min" | "1–2 hrs";
  status: FindingStatus;
};

export type TargetState = {
  url: string;
  hostname: string;
  token: string;
  verified: boolean;
  consented: boolean;
  /** Server-assigned target ID once a real target has been registered via the API. */
  targetId?: string;
};
