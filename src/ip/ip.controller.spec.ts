import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IpController } from './ip.controller';
import { IpService } from './ip.service';
import { Ip } from './ip.interface';
import { IpEntity } from './ip.entity';
import { AuthService } from '../auth/auth.service';

describe('IpController', () => {
  let ipController: IpController;
  let ipService: IpService;

  const mockIpEntity = {
    ip: '192.168.1.1',
    ipJson: JSON.stringify({ ip: '192.168.1.1', location: 'US' }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IpController],
      providers: [
        IpService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('https://ipwho.is') },
        },
        {
          provide: AuthService,
          useValue: { validateApiKey: jest.fn().mockReturnValue(true) },
        },
        {
          provide: getRepositoryToken(IpEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockIpEntity),
            save: jest.fn().mockResolvedValue(mockIpEntity),
            delete: jest.fn().mockResolvedValue(mockIpEntity),
          },
        },
      ],
    }).compile();

    ipController = app.get<IpController>(IpController);
    ipService = app.get<IpService>(IpService);
  });

  describe('lookupIp', () => {
    it('should return IP information', async () => {
      const expectedIp = { address: '127.0.0.1', country: 'US' };
      jest
        .spyOn(ipService, 'lookupIp')
        .mockResolvedValue(expectedIp as unknown as Ip);

      const ip = await ipController.lookupIp('127.0.0.1');
      expect(ip).toEqual(expectedIp);
    });

    it('should return "Invalid IP address" if IP address is invalid', async () => {
      jest
        .spyOn(ipService, 'lookupIp')
        .mockRejectedValue(new Error('Invalid IP address'));

      try {
        await ipController.lookupIp('invalid-ip');
      } catch (err) {
        expect(err.message).toBe('Invalid IP address');
      }
    });
  });

  describe('removeIp', () => {
    it('should remove IP from database', async () => {
      const removeIpSpy = jest.spyOn(ipService, 'removeIp');

      await ipController.removeIp('127.0.0.1');
      expect(removeIpSpy).toHaveBeenCalledWith('127.0.0.1');
    });

    it('should return "Invalid IP address" if IP address is invalid', async () => {
      jest
        .spyOn(ipService, 'removeIp')
        .mockRejectedValue(new Error('Invalid IP address'));

      try {
        await ipController.removeIp('invalid-ip');
      } catch (err) {
        expect(err.message).toBe('Invalid IP address');
      }
    });
  });
});
