import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}
  public async uploadArquivo(file: any, id: string) {
    const accessKeyId = this.configService.get('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('S3_SECRET_ACCESSKEY');

    const s3 = new AWS.S3({
      region: 'as-east-1',
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    const fileExtension = file.originalname.split('.')[1];

    const urlKey = `${id}.${fileExtension}`;

    console.log('urlKey', urlKey);

    const params = {
      Body: file.buffer,
      Bucket: 'smartrankingmat',
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
