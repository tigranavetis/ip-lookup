import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './apiKey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private apiKeyRepository: Repository<ApiKeyEntity>,
  ) {}

  // Basic validation by API Key and rate limiting for demonstration purposes
  // Parallel requests are not handled properly
  async validateApiKey(key: string | string[]): Promise<boolean> {
    let apiKeyEntity: ApiKeyEntity;
    if (typeof key === 'string') {
      apiKeyEntity = await this.apiKeyRepository.findOne({ where: { key } });
    }

    if (!apiKeyEntity || apiKeyEntity?.calls >= 50) {
      return false;
    }

    apiKeyEntity.calls++;
    await this.apiKeyRepository.save(apiKeyEntity);

    return true;
  }
}
