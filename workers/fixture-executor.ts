import type { IsolatedScanExecutor, ScanJob, WorkerFinding } from "./scan-contract";

// Fixture-only executor for demos and automated tests. It makes no network requests.
export const fixtureExecutor: IsolatedScanExecutor = {
  async run(): Promise<WorkerFinding[]> {
    return [{
      ruleId: "cookie-secure",
      category: "Session security",
      severity: "high",
      title: "Session cookie is missing the Secure flag",
      evidence: { header: "Set-Cookie", secure: false },
      ownerExplanation: {
        English: "Customer login sessions could be exposed on an unsafe network.",
        Hindi: "असुरक्षित नेटवर्क पर ग्राहक के लॉगिन सत्र उजागर हो सकते हैं।",
        Hinglish: "Unsafe network par customer login session expose ho sakta hai.",
      },
      developerGuidance: "Set Secure on authentication cookies and serve the application exclusively over HTTPS.",
    }];
  },
};
