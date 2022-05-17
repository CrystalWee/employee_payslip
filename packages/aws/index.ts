import AWS from "aws-sdk";
import get from "lodash.get";

const SDK: any = AWS;
const cache = new Map();

const { AWS_REGION } = process.env;

SDK.config.update({ region: AWS_REGION });

interface AwsConfig {
  service: string;
  options?: any;
  method: string;
  parameters?: any;
}

export const aws = (config: AwsConfig): Promise<any> => {
  console.debug({ config });

  const Service = get(SDK, config.service);
  if (Service == null)
    return Promise.reject(
      new Error(`Unable to resolve ${config.service} via AWS SDK`)
    );

  let cachedService;

  if (cache.has(config.service)) {
    cachedService = cache.get(config.service);
  } else {
    cachedService = new Service(config.options);
    cache.set(config.service, cachedService);
  }

  const serviceMethodName = `${config.service}.${config.method}`;
  const serviceMethod = cachedService[config.method];
  if (serviceMethod == null)
    return Promise.reject(
      new Error(`Unable to resolve ${serviceMethodName} via AWS SDK`)
    );

  return cachedService[config.method](config.parameters).promise();
};

export default aws;
