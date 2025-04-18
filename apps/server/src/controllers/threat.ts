import { Threat } from "../db/models";

export interface IThreat {
    type: string;
    confidence: number;
    risk_score: number;
    details: {
      reason: string;
      people_count: number;
      possible_actions: string[];
      faces_visible: number;
    };
  }

export const createThreat = async (dto: IThreat, createdBy: string) => {
    const newThreat = await Threat.create({
        ...dto, cctv: createdBy
    });
    return newThreat
}

export const getAllThreat = async (cctvId: string) => {
    const threat = await Threat.find({
      cctv: cctvId  
    })
    return threat;
}