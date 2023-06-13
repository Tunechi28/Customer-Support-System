import * as service from '../customer-service';
import * as customerRepository from './../customer-repository';
import * as authToken from '../../../lib/token';
import * as bcrypt from 'bcryptjs';
import { getRedisInstance, initRedis} from "../../../lib/redis";
import * as emailLib from '../../../lib/email';

// Mock dependencies
jest.mock('../customer-repository');
jest.mock('../../../lib/token');
jest.mock('bcryptjs');
jest.mock('../../../lib/redis');
jest.mock('nanoid');
jest.mock('../../../lib/email');


describe('Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateLoginCredentials', () => {
    it('should validate login credentials and return token', async () => {
      const payload = { email: 'test@example.com', password: 'password' };
      const mockCustomer = { _id: '123', email: 'test@example.com', password: 'hashedPassword' };
      const mockToken = 'mockToken';
      (customerRepository.findCustomer as jest.Mock).mockResolvedValue(mockCustomer);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (authToken.sign as jest.Mock).mockResolvedValue(mockToken);

      const result = await service.validateLoginCredentials(payload);

      expect(result.token).toBe(mockToken);
      expect(customerRepository.findCustomer).toHaveBeenCalledWith({ email: payload.email });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(payload.password, mockCustomer.password);
      expect(authToken.sign).toHaveBeenCalledWith({ id: mockCustomer._id, email: mockCustomer.email });
    });

    // Rest of the test cases
  });

  describe('createSessionToken', () => {
    it('should create a session token for the customer', async () => {
      const mockCustomer = { _id: '123', email: 'test@example.com' };
      const mockToken = 'mockToken';
      (authToken.sign as jest.Mock).mockResolvedValue(mockToken);

      const result = await service.createSessionToken(mockCustomer);

      expect(result).toBe(mockToken);
      expect(authToken.sign).toHaveBeenCalledWith({ id: mockCustomer._id, email: mockCustomer.email });
    });

  });

  describe('validateSignupCredentials', () => {
    it('should validate signup credentials and create a new customer', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        companyName: 'Acme Inc.',
      };
      const mockCustomer = {
        _id: '123',
        email: payload.email,
        password: 'hashedPassword',
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        companyName: payload.companyName,
        toObject: jest.fn().mockReturnThis()
      };
      const mockToken = 'mockToken';
      (customerRepository.findCustomerWithFilters as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (customerRepository.createCustomer as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await service.validateSignupCredentials(payload);


      expect(result.email).toBe(mockCustomer.email);
      expect(result.token).toBe(mockToken);
      expect(customerRepository.findCustomerWithFilters).toHaveBeenCalledWith({ email: payload.email }, { phoneNumber: payload.phoneNumber });
      expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, 10);
      expect(customerRepository.createCustomer).toHaveBeenCalledWith({
        email: payload.email,
        password: 'hashedPassword',
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        companyName: payload.companyName,
      });
    });

    it('should throw CustomerAlreadyExists error if customer already exists', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        companyName: 'Acme Inc.',
      };
      (customerRepository.findCustomerWithFilters as jest.Mock).mockResolvedValue({ _id: '123' });

      await expect(service.validateSignupCredentials(payload)).rejects.toThrow('This customer has already been registered');
      expect(customerRepository.findCustomerWithFilters).toHaveBeenCalledWith({ email: payload.email }, { phoneNumber: payload.phoneNumber });
    });
  });

  describe('changePassword', () => {
    it('should change customer password', async () => {
      const payload = {
        customer: {
          id: '123',
        },
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      };
      const mockCustomer = {
        _id: '123',
        password: 'hashedPassword',
      };
      (customerRepository.findCustomer as jest.Mock).mockResolvedValue(mockCustomer);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (customerRepository.updateCustomer as jest.Mock).mockResolvedValue(mockCustomer);

      await service.changePassword(payload);

      expect(customerRepository.findCustomer).toHaveBeenCalledWith({ _id: payload.customer.id });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(payload.oldPassword, mockCustomer.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(payload.newPassword, 10);
      expect(customerRepository.updateCustomer).toHaveBeenCalledWith(
        { _id: payload.customer.id },
        { password: 'newHashedPassword' }
      );
    });
    it('should throw Error if customer is not found', async () => {
        const payload = {
          customer: {
            id: '123',
          },
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        };
        (customerRepository.findCustomer as jest.Mock).mockResolvedValue(null);
  
        await expect(service.changePassword(payload)).rejects.toThrow('Customer not found');
        expect(customerRepository.findCustomer).toHaveBeenCalledWith({ _id: payload.customer.id });
      });
  
      it('should throw Error if old password is incorrect', async () => {
        const payload = {
          customer: {
            id: '123',
          },
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        };
        const mockCustomer = {
          _id: '123',
          password: 'hashedPassword',
        };
        (customerRepository.findCustomer as jest.Mock).mockResolvedValue(mockCustomer);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

        await expect(service.changePassword(payload)).rejects.toThrow('password is incorrect');
        expect(customerRepository.findCustomer).toHaveBeenCalledWith({ _id: payload.customer.id });
        expect(bcrypt.compareSync).toHaveBeenCalledWith(payload.oldPassword, mockCustomer.password);
      });
    });

    describe('sendPasswordResetCode', () => {
    
        it('should throw Error if customer is not found', async () => {
            const redisClient = { 
                setex: jest.fn().mockImplementation((key, expiration, code, callback) => {
                  callback(null, 'OK');
                }),
              };

          const email = 'test@example.com';
          (customerRepository.findCustomer as jest.Mock).mockResolvedValue(null);
    
          await expect(service.requestPasswordReset({ identifier: email, identifierType: "email" })).rejects.toThrow('Customer not found');
          expect(customerRepository.findCustomer).toHaveBeenCalledWith({ email });
          expect(redisClient.setex).not.toHaveBeenCalled();
          expect(emailLib.sendEmail).not.toHaveBeenCalled();
        });
      });
      
      describe('getProfile', () => {
        it('should return the customer profile', async () => {
          const customerId = '123';
          const mockCustomer = { _id: customerId, firstName: 'John', lastName: 'Doe' };
          (customerRepository.findCustomer as jest.Mock).mockResolvedValue(mockCustomer);
      
          const result = await service.getProfile(customerId);
      
          expect(result).toEqual(mockCustomer);
          expect(customerRepository.findCustomer).toHaveBeenCalledWith({ _id: customerId });
        });
      });
      
});
