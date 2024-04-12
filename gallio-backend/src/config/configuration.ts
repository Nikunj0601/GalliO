import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

let config = null;

export const loadEager = async () => {
  config = {
    port: process.env.PORT || 8080,
    database: {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    awsCredentials: {
      awsSecretManagerSecretId: process.env.AWS_SECRETS_MANAGER_SECRET_ID,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
      sessionToken: process.env.AWS_SESSION_TOKEN,
      region: process.env.AWS_REGION,
    },
  };

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
  });

  const input = new GetSecretValueCommand({
    SecretId: config.awsCredentials.awsSecretManagerSecretId,
  });

  const response = client.send(input);
  const secrets = JSON.parse((await response).SecretString);
  config = {
    ...config,
    awsS3: { bucket: secrets.AWS_S3_BUCKET },
    awsCloudFront: {
      distributionId: secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID,
    },
    awsSNS: {
      topicARN: secrets.AWS_SNS_TOPIC_ARN,
    },
  };
  return config;
};

export default async () => {
  return config || (await loadEager());
};
