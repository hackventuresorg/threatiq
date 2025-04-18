import { CCTV, Organization } from "../db/models";
import { BadRequestError } from "../middlewares/errorMiddleware";

const createCCTV = async ({
  name,
  location,
  fullUrl,
  isActive,
  streamHealth,
  organization,
  tags,
  detectionSettings,
  user,
}: any) => {
  if (!name || !location || !organization || !fullUrl) {
    throw new BadRequestError("Please provide all required fields");
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
    fullUrl,
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

const editCCTV = async ({
  _id,
  name,
  location,
  fullUrl,
  isActive,
  streamHealth,
  organization,
  tags,
  detectionSettings,
  user,
}: any) => {
  if (!_id) {
    throw new BadRequestError("Please provide CCTV ID");
  }

  const org = await Organization.findOne({
    _id: organization,
    $or: [{ users: user }, { createdBy: user }],
  });

  if (!org) {
    throw new BadRequestError("You are not authorized to access this organization");
  }

  const existingCCTV = await CCTV.findOne({
    _id: _id,
    organization: org._id,
  });

  if (!existingCCTV) {
    throw new BadRequestError("CCTV not found or you don't have permission to edit it");
  }

  const updatedCCTV = await CCTV.findByIdAndUpdate(
    _id,
    {
      name,
      location,
      fullUrl,
      isActive,
      streamHealth,
      tags,
      detectionSettings,
    },
    { new: true, runValidators: true }
  );

  return updatedCCTV;
};

export { createCCTV, getAllCCTV, editCCTV };
