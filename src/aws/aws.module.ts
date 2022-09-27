import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsService } from './aws.service';

@Module({
  imports: [],
  providers: [AwsService, AwsCognitoConfig, AwsCognitoService],
  exports: [AwsService, AwsCognitoConfig, AwsCognitoService],
})
export class AwsModule {}
