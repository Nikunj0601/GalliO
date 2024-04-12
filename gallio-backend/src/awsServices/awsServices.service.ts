import {
  DetectModerationLabelsCommand,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  PublishCommand,
  SNSClient,
  SubscribeCommand,
} from '@aws-sdk/client-sns';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Gallery } from 'src/gallery/gallery.model';
import {
  CloudFrontClient,
  GetDistributionCommand,
  GetDistributionCommandInput,
} from '@aws-sdk/client-cloudfront';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AWSServicesService {
  private readonly s3Client: S3Client;
  private readonly rekognitionClient: RekognitionClient;
  private readonly snsClient: SNSClient;
  private readonly cloudFrontClient: CloudFrontClient;
  constructor(private readonly configService: ConfigService) {
    console.log(this.configService.get('awsCredentials.region'));

    this.s3Client = new S3Client({
      region: this.configService.get('awsCredentials.region'),
      credentials: {
        accessKeyId: this.configService.get('awsCredentials.accessKeyId'),
        secretAccessKey: this.configService.get(
          'awsCredentials.secretAccessKey',
        ),
        sessionToken: this.configService.get('awsCredentials.sessionToken'),
      },
    });
    this.rekognitionClient = new RekognitionClient({
      region: this.configService.get('awsCredentials.region'),
      credentials: {
        accessKeyId: this.configService.get('awsCredentials.accessKeyId'),
        secretAccessKey: this.configService.get(
          'awsCredentials.secretAccessKey',
        ),
        sessionToken: this.configService.get('awsCredentials.sessionToken'),
      },
    });
    this.snsClient = new SNSClient({
      region: this.configService.get('awsCredentials.region'),
      credentials: {
        accessKeyId: this.configService.get('awsCredentials.accessKeyId'),
        secretAccessKey: this.configService.get(
          'awsCredentials.secretAccessKey',
        ),
        sessionToken: this.configService.get('awsCredentials.sessionToken'),
      },
    });
    this.cloudFrontClient = new CloudFrontClient({
      region: this.configService.get('awsCredentials.region'),
      credentials: {
        accessKeyId: this.configService.get('awsCredentials.accessKeyId'),
        secretAccessKey: this.configService.get(
          'awsCredentials.secretAccessKey',
        ),
        sessionToken: this.configService.get('awsCredentials.sessionToken'),
      },
    });
  }

  async uploadPhotoToS3(params: any) {
    try {
      console.log(params);

      await this.s3Client.send(new PutObjectCommand(params));
      console.log('File uploaded successfully');
      return true;
    } catch (err) {
      console.log('******');

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getCloudFrontDomainName() {
    const input: GetDistributionCommandInput = {
      Id: this.configService.get('awsCloudFront.distributionId'),
    };
    const command = new GetDistributionCommand(input);
    return await this.cloudFrontClient.send(command);
  }

  async getPresignedUrl(photo: Gallery) {
    const param = {
      Key: photo.path,
      Bucket: this.configService.get('awsS3.bucket'),
    };
    const command = new GetObjectCommand(param);
    const preSignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 86400,
    });
    return preSignedUrl;
  }

  async detectModerationLabelsFromImage(imageKeyPath: string) {
    const forbiddenLabels = [
      'Explicit Nudity',
      'Violence',
      'Visually Disturbing',
      'Rude Gestures',
      'Tobacco',
      'Drugs & Tobacco',
      'Gambling',
      'Hate Symbols',
    ];

    const params = {
      Image: {
        S3Object: {
          Bucket: this.configService.get('awsS3.bucket'),
          Name: imageKeyPath,
        },
      },
      MinConfidence: 60,
    };

    const input: DetectModerationLabelsCommand =
      new DetectModerationLabelsCommand(params);
    const { ModerationLabels } = await this.rekognitionClient.send(input);
    console.log('asdbjashdkjasbn');

    if (!ModerationLabels || ModerationLabels.length === 0) {
      return [];
    }

    // If some labels found -> compare them with forbidden labels
    const labels = ModerationLabels.map((label) => label.ParentName).filter(
      Boolean,
    );
    console.log('Found labels:', JSON.stringify(labels));

    const foundForbiddenLabels = labels.filter((label) =>
      forbiddenLabels.includes(label),
    );
    console.log(
      'Found forbidden labels:',
      JSON.stringify(foundForbiddenLabels),
    );
    return foundForbiddenLabels;
  }

  async sendEmailSNS(email: string, message: string) {
    // await this.subscribeEmailtoSNS(email);
    const snsParams = {
      Message: message,
      TopicArn: this.configService.get('awsSNS.topicARN'),
      Subject: 'Moderation Labels Detected',
      MessageAttributes: {
        email: {
          DataType: 'String',
          StringValue: email,
        },
      },
    };

    try {
      await this.snsClient.send(new PublishCommand(snsParams));
      console.log('Message published to SNS.');
    } catch (error) {
      console.error('Error publishing message to SNS:', error);
      throw error;
    }
  }

  async subscribeEmailtoSNS(email: string) {
    const subscribeParams = {
      Protocol: 'email',
      TopicArn: this.configService.get('awsSNS.topicARN'),
      Endpoint: email,
    };

    try {
      await this.snsClient.send(new SubscribeCommand(subscribeParams));
      console.log(`Email ${email} subscribed to SNS topic.`);
    } catch (error) {
      console.error('Error subscribing email to SNS topic:', error);
      throw error;
    }
  }
}
