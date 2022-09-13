import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}
  public async uploadArquivo(file: any, id: string) {
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'S3_SECRET_ACCESSKEY',
    );
    const region = this.configService.get<string>('S3_REGION');
    const bucket = this.configService.get<string>('S3_BUCKET');

    const s3 = new AWS.S3({
      region: region,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    const fileExtension = file.originalname.split('.')[1];

    const urlKey = `${id}.${fileExtension}`;

    const params = {
      Body: file.buffer,
      Bucket: bucket,
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return data;
        },
        (err) => {
          console.log(err);
          return err;
        },
      );

    return data;
  }
}
