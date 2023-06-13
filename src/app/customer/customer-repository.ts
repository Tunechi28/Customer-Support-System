import { FilterQuery} from "mongoose";
import {Customer,  ICustomer } from "../../database/models/customer-model/customer.model";

export const createCustomer = async (
  customer: Partial<ICustomer>
): Promise<ICustomer> => {
  const createdCustomer = await Customer.create(
    customer
  );
  return createdCustomer;
};

export const findCustomer = async (
    filter: Partial<ICustomer>
  ): Promise<ICustomer | null> => {
    const customer = await Customer.findOne<ICustomer>(
      filter as FilterQuery<ICustomer>).select("+password").lean();
    return customer;
  };

  export const findCustomerWithFilters = async (
    filter1: any,
    filter2: any
  ): Promise<ICustomer | null> => {
    return await Customer.findOne({
      $or: [filter1, filter2],
    }).exec();
  };

  export const findCustomers = async (
    filter: Partial<ICustomer>,
    cur?: string | undefined,
    take?: number | undefined
  ): Promise<ICustomer[]> => {
    const customers = await Customer.find<ICustomer>(
        filter as FilterQuery<ICustomer>
    )
      .sort({ createdAt: "desc" })
      .limit(take || 0)
      .skip(cur ? 1 : 0)
      .exec();
    return customers;
  };
  
export const updateCustomer = async (
  filter: Partial<ICustomer>,
  update: Partial<ICustomer>
): Promise<ICustomer | null> => {
  const updatedCustomer = await Customer.findOneAndUpdate(
    filter as FilterQuery<ICustomer>,
    update,
    { new: true }
  );
  return updatedCustomer;
};

export const deleteCustomer = async (
  filter: Partial<ICustomer>
): Promise<ICustomer | null> => {
  const deletedCustomer = await Customer.findOneAndDelete(
    filter as FilterQuery<ICustomer>);
  return deletedCustomer;
};
