import { CCTV, Threat, Organization } from "../db/models";
import { BadRequestError, UnauthorizedError } from "../middlewares/errorMiddleware";

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
    ...dto,
    cctv: createdBy,
  });
  return newThreat;
};

export const getAllThreat = async (userId: string, cctvId: string) => {
  const cctv = await CCTV.findById(cctvId);
  if (!cctv) {
    throw new BadRequestError("CCTV not found");
  }

  const organization = await Organization.findOne({
    _id: cctv.organization,
    $or: [{ createdBy: userId }, { members: userId }],
  });

  if (!organization) {
    throw new UnauthorizedError("You are not authorized to access this CCTV");
  }

  const threat = await Threat.find({
    cctv: cctvId,
  }).sort({ createdAt: -1 });

  return threat;
};
