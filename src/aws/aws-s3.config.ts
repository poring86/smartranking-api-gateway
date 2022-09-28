import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Config {
  constructor(private configService: ConfigService) {}
  public accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
  public secretAccessKey = this.configService.get<string>(
    'S3_SECRET_ACCESSKEY',
  );
  public region = this.configService.get<string>('S3_REGION');
  public bucket = this.configService.get<string>('S3_BUCKET');
}
