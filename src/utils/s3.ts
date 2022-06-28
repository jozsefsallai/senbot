import AWS from 'aws-sdk';
import { S3Config } from '../config/IConfig';

class S3 {
  private s3: AWS.S3;
  private endpoint: string;
  private bucket: string;

  constructor(opts: S3Config) {
    this.endpoint = opts.endpoint;
    const endpoint = new AWS.Endpoint(this.endpoint);

    this.s3 = new AWS.S3({
      endpoint,
      credentials: {
        accessKeyId: opts.accessKeyId,
        secretAccessKey: opts.secretAccessKey,
      },
    });

    this.bucket = opts.bucket;
  }

  async exists(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    return new Promise((resolve, reject) => {
      return this.s3.headObject(params, (err) => {
        if (err) {
          if (err.code === 'NotFound') {
            return resolve(false);
          }

          return reject(err);
        }

        return resolve(true);
      });
    });
  }

  async upload(key: string, data: Buffer): Promise<void> {
    const params = {
      ACL: 'public-read',
      Bucket: this.bucket,
      Key: key,
      Body: data,
      ContentType: 'text/plain', // TODO: Determine content type
    };

    return new Promise((resolve, reject) => {
      return this.s3.putObject(params, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  async download(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    return this.s3.getObject(params).createReadStream();
  }

  buildUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`;
  }
}

export default S3;
