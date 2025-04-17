import { Organization } from "../db/models";
import { BadRequestError } from "../middlewares/errorMiddleware";

const createOrganization = async ({
  name,
  description,
  location,
  type,
  logoUrl,
  createdBy,
}: any) => {
  if (!name || !description || !location || !type || !createdBy) {
    throw new BadRequestError("Please provide all the required fields");
  }

  const organization = await Organization.create({
    name,
    description,
    location,
    type,
    logoUrl,
    createdBy,
  });

  return organization;
};

const getAllOrganizations = async (userId: string) => {
  const organizations = await Organization.find({
    $or: [{ createdBy: userId }, { users: userId }],
  });
  return organizations;
};

export { createOrganization, getAllOrganizations };
