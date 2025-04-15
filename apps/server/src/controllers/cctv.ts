import { CCTV, Organization } from "../db/models";
import { BadRequestError } from "../middlewares/errorMiddleware";

const createCCTV = async ({
  name,
  location,
  publicIp,
  port,
  username,
  password,
  rtspPath,
  protocol,
  fullRTSPUrl,
  isActive,
  streamHealth,
  organization,
  tags,
  detectionSettings,
  user,
}: any) => {
  if (!name || !location || !organization) {
    throw new BadRequestError("Please provide all  required fields");
  }

  const org = await Organization.findOne({
    _id: organization,
    $or: [{ users: user }, { createdBy: user }],
  });

  if (!org) {
    throw new BadRequestError("You are not authorized to access this organization");
  }

  const cctv = await CCTV.create({
    name,
    location,
    publicIp,
    port,
    username,
    password,
    rtspPath,
    protocol,
    fullRTSPUrl,
    isActive,
    streamHealth,
    organization: org?._id,
    tags,
    detectionSettings,
  });
  return cctv;
};

const getAllCCTV = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const org = await Organization.findOne({
    _id: organizationId,
    $or: [{ users: userId }, { createdBy: userId }],
  });

  if (!org) {
    throw new BadRequestError("You are not authorized to access this organization");
  }

  const cctvs = await CCTV.find({ organization: org?._id });
  return cctvs;
};

export { createCCTV, getAllCCTV };
