import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

import { IpEntity } from './ip.entity';
import { IpService } from './ip.service';

describe('IpService', () => {
  let ipService: IpService;
  let configService: ConfigService;
  let ipRepository: Repository<IpEntity>;

  const mockIpEntity = {
    ip: '192.168.1.1',
    ipJson: JSON.stringify({ ip: '192.168.1.1', location: 'US' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('https://ipwho.is') },
        },
        {
          provide: getRepositoryToken(IpEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockIpEntity),
            save: jest.fn().mockResolvedValue(mockIpEntity),
            delete: jest.fn().mockResolvedValue(mockIpEntity),
          },
        },
        {
          provide: 'IpEntityRepository',
          useClass: Repository<IpEntity>,
        },
      ],
    }).compile();

    ipService = module.get<IpService>(IpService);
    configService = module.get<ConfigService>(ConfigService);
    ipRepository = module.get<Repository<IpEntity>>('IpEntityRepository');
  });

  it('should return IP information when IP is valid', async () => {
    const ipInfo = { ip: '127.0.0.1', country: 'United States' };
    ipRepository.findOne = jest.fn().mockResolvedValueOnce({
      ip: ipInfo.ip,
      ipJson: JSON.stringify(ipInfo),
    });
    const result = await ipService.lookupIp(ipInfo.ip);
    expect(result).toEqual(ipInfo);
    expect(ipRepository.findOne).toHaveBeenCalledWith({
      where: { ip: ipInfo.ip },
    });
  });

  it('should return IP information when IP is not found in DB and API call is successful', async () => {
    const ipInfo = { ip: '127.0.0.1', country: 'United States' };
    ipRepository.findOne = jest.fn().mockResolvedValueOnce(null);
    axios.get = jest.fn().mockResolvedValueOnce({ data: ipInfo });
    ipRepository.save = jest.fn().mockResolvedValueOnce({});

    const result = await ipService.lookupIp(ipInfo.ip);
    expect(result).toEqual(ipInfo);
    expect(ipRepository.findOne).toHaveBeenCalledWith({
      where: { ip: ipInfo.ip },
    });
    const apiUrl = configService.get('API_URL');
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/${ipInfo.ip}`);
    expect(ipRepository.save).toHaveBeenCalledWith({
      ip: ipInfo.ip,
      ipJson: JSON.stringify(ipInfo),
    });
  });

  it('should throw an error when IP is not found in DB and API call fails', async () => {
    ipRepository.findOne = jest.fn().mockResolvedValueOnce(null);
    axios.get = jest.fn().mockRejectedValueOnce(null);
    try {
      await ipService.lookupIp('ip');
    } catch (err) {
      expect(err.message).toBe('Failed to get IP info from API');
    }
  });

  it('should save IP info to DB', async () => {
    const ipInfo = { ip: 'ip' };
    ipRepository.findOne = jest.fn().mockResolvedValueOnce(null);
    axios.get = jest.fn().mockResolvedValueOnce({ data: ipInfo });
    ipRepository.save = jest.fn().mockResolvedValueOnce({});
    await ipService.lookupIp('ip');
    expect(ipRepository.save).toHaveBeenCalledWith({
      ip: ipInfo.ip,
      ipJson: JSON.stringify(ipInfo),
    });
  });

  it('should remove IP from the database', async () => {
    ipRepository.delete = jest.fn().mockResolvedValueOnce({});
    await ipService.removeIp('ip');
    expect(ipRepository.delete).toHaveBeenCalledWith({ ip: 'ip' });
  });

  it('should throw an error when removing IP from the database fails', async () => {
    ipRepository.delete = jest.fn().mockRejectedValueOnce({});
    try {
      await ipService.removeIp('ip');
    } catch (err) {
      expect(err.message).toBe('Failed to remove IP');
    }
  });
});
