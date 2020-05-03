const config = {
  dev: {
    baseUrl: 'http://localhost:3000/api',
    version: 'v1',
  },
  staging: {
    baseUrl: 'http://192.168.1.2:3000/api',
  },
  prod: {
    baseUrl: 'http://192.168.1.2:3000/api',
  },
};

function getConfig(releaseChannel) {
  if (!releaseChannel) {
    // since releaseChannels are undefined in dev, return your default.
    return config.dev;
  }
  // this would pick up prod-v1, prod-v2, prod-v3
  if (releaseChannel.indexOf('prod') !== -1) return config.prod;

  // return staging environment variables
  if (releaseChannel.indexOf('staging') !== -1) return config.staging;

  return config.dev;
}

const foundConfig = getConfig();

console.log('foundConfig', foundConfig);

export const CUSTOMER_URL = foundConfig.customerUrl;
export const BASE_URI = foundConfig.baseUrl;
export default foundConfig;
