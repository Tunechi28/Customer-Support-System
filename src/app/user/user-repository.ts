import { FilterQuery} from "mongoose";
import {User,  IUser } from "../../database/models/user-model/user.model";

export const createUser = async (
  user: Partial<IUser>
): Promise<IUser> => {
  const createdUser = await User.create(
    user
  );
  return createdUser;
};

export const findUser = async (
    filter: Partial<IUser>
  ): Promise<IUser | null> => {
    const user = await User.findOne<IUser>(
      filter as FilterQuery<IUser>).select("+password").lean();
    return user;
  };

  export const findUsers = async (
    filter?: Partial<IUser>,
    cur?: string | undefined,
    take?: number | undefined
  ): Promise<IUser[]> => {
    const users = await User.find<IUser>(
        filter as FilterQuery<IUser>
    )
      .sort({ createdAt: "desc" })
      .limit(take || 0)
      .skip(cur ? 1 : 0)
      .exec();
    return users;
  };
  
export const updateUser = async (
  filter: Partial<IUser>,
  update: Partial<IUser>
): Promise<IUser | null> => {
  const updatedUser = await User.findOneAndUpdate(
    filter as FilterQuery<IUser>,
    update,
    { new: true }
  );
  return updatedUser;
};

export const deleteUser = async (
  filter: Partial<IUser>
): Promise<IUser | null> => {
  const deletedUser = await User.findOneAndDelete(
    filter as FilterQuery<IUser>);
  return deletedUser;
};
