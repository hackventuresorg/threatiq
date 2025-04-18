
interface ThreatDetails {
    reason: string;
    people_count: number;
    possible_actions: string[];
    faces_visible: number;
  }
  
  interface IThreat {
    _id: string;
    type: string;
    confidence: number;
    risk_score: number;
    details: ThreatDetails;
    createdAt: string;
    cctv: string;
  }