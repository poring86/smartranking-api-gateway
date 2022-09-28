import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';

@Injectable()
export class AwsS3Service {
  constructor(private awsS3Config: AwsS3Config) {}

  public async uploadArquivo(file: any, id: string) {
    console.log('file', file);
    try {
      const s3 = new AWS.S3({
        region: this.awsS3Config.region,
        accessKeyId: this.awsS3Config.accessKeyId,
        secretAccessKey: this.awsS3Config.secretAccessKey,
      });

      const fileExtension = file.originalname.split('.')[1];

      const urlKey = `${id}.${fileExtension}`;

      const params = {
        Body: file.buffer,
        Bucket: this.awsS3Config.bucket,
        Key: urlKey,
      };

      // const data = s3
      //   .putObject(params)
      //   .promise()
      //   .then(
      //     () => {
      //       return {
      //         url: `https://matheus86.s3.amazonaws.com/${urlKey}`,
      //       };
      //     },
      //     (err) => {
      //       console.log(err);
      //       return err;
      //     },
      //   );

      const result = await s3.putObject(params).promise();

      console.log('result', result);

      return {
        url: `https://matheus86.s3.amazonaws.com/${urlKey}`,
      };
    } catch (e) {}
  }
}
