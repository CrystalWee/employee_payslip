test('a valid aws config expected to return result', async () => {
  jest.resetModules();

  const expected = { Account: '000000' };

  const mockAwsSdk = {
    config: { update: () => {} },
    STS: jest.fn().mockImplementation(() => ({
      getCallerIdentity: () => ({ promise: () => Promise.resolve(expected) }),
    })),
  };

  jest.mock('aws-sdk', () => mockAwsSdk);

  const { default: aws } = require('../index');
  const actual = aws({ service: 'STS', method: 'getCallerIdentity' });
  await expect(actual).resolves.toEqual(expected);
});

test('a valid aws config and a cached service expected to return result', async () => {
  const expected = { Account: '000000' };

  const mockAwsSdk = {
    config: { update: () => {} },
    STS: jest.fn().mockImplementation(() => ({
      getCallerIdentity: () => ({ promise: () => Promise.resolve(expected) }),
    })),
  };

  jest.mock('aws-sdk', () => mockAwsSdk);

  const { default: aws } = require('../index');
  const actual = aws({ service: 'STS', method: 'getCallerIdentity' });
  await expect(actual).resolves.toEqual(expected);
});

test('an invalid service expected to reject with an error', async () => {
  jest.resetModules();

  const mockAwsSdk = {
    config: { update: () => {} },
  };

  jest.mock('aws-sdk', () => mockAwsSdk);

  const { default: aws } = require('../index');
  const actual = aws({ service: 'STS', method: 'getCallerIdentity' });
  await expect(actual).rejects.toEqual(new Error('Unable to resolve STS via AWS SDK'));
});

test('an invalid service method expected to reject with an error', async () => {
  jest.resetModules();

  const mockAwsSdk = {
    config: { update: () => {} },
    STS: jest.fn().mockImplementation(() => {}),
  };

  jest.mock('aws-sdk', () => mockAwsSdk);

  const { default: aws } = require('../index');
  const actual = aws({ service: 'STS', method: 'getCallerIdentity' });
  await expect(actual).rejects.toEqual(new Error('Unable to resolve STS.getCallerIdentity via AWS SDK'));
});
