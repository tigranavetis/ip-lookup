import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

import { Ip } from './ip.interface';
import { IpEntity } from './ip.entity';

@Injectable()
export class IpService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(IpEntity) private ipRepository: Repository<IpEntity>,
  ) {}

  async lookupIp(ip: string): Promise<Ip> {
    let ipInfo = await this.getIpInfoFromDB(ip);
    if (!ipInfo) {
      ipInfo = await this.getIpInfoFromAPI(ip);
      await this.saveIpInfoToDB(ipInfo);
    }
    return ipInfo;
  }

  async removeIp(ip: string): Promise<void> {
    try {
      await this.ipRepository.delete({ ip });
    } catch (err) {
      throw new InternalServerErrorException('Failed to remove IP');
    }
  }

  private async getIpInfoFromDB(ip: string): Promise<Ip> {
    try {
      const ipEntity = await this.ipRepository.findOne({ where: { ip } });
      return ipEntity?.ipJson ? JSON.parse(ipEntity.ipJson) : null;
    } catch (err) {
      throw new InternalServerErrorException('Failed to get IP info from DB');
    }
  }

  private async getIpInfoFromAPI(ip: string): Promise<Ip> {
    try {
      const apiUrl = this.configService.get('API_URL');
      const { data } = await axios.get(`${apiUrl}/${ip}`);
      return data;
    } catch (err) {
      throw new InternalServerErrorException('Failed to get IP info from API');
    }
  }

  private async saveIpInfoToDB(ipInfo: Ip): Promise<void> {
    try {
      await this.ipRepository.save({
        ip: ipInfo.ip,
        ipJson: JSON.stringify(ipInfo),
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed to save IP info to DB');
    }
  }
}
