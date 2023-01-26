import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isIPv4, isIPv6 } from 'net';

@Injectable()
export class IpValidationMiddleware implements NestMiddleware {
  use(
    @Param('ip') req: Request,
    res: Response,
    next: (error?: Error | any) => void,
  ) {
    const { ip } = req.params;
    if (!isIPv4(ip) && !isIPv6(ip)) {
      throw new BadRequestException('Invalid IP address');
    }
    next();
  }
}
