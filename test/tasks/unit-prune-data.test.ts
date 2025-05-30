// * These tests ensure the exported interfaces under test function as expected.

// import { useMockDateNow } from 'multiverse/mongo-common';
// import { getDb } from 'multiverse/mongo-schema';
// import { setupMemoryServerOverride } from 'multiverse/mongo-test';

// import {
//   mockEnvFactory,
//   protectedImportFactory,
//   withMockedOutput
// } from 'testverse/setup';

// import { TrialError, ValidationError } from 'universe/error';

// // * Follow the steps (below) to tailor these tests to this specific project 😉

// // ? Ensure the isolated external picks up the memory server override
// jest.mock('multiverse/mongo-schema', (): typeof import('multiverse/mongo-schema') => {
//   return jest.requireActual('multiverse/mongo-schema');
// });

// // // * Step 1: Add new collections here w/ keys of form: database.collection
// // ! Only do step 1 if you're using count-based limits and NOT byte-based!
// // const testCollectionsMap = {
// //   'root.request-log': dummyRootData['request-log'].length,
// //   'root.limited-log': dummyRootData['limited-log'].length,
// //   ...
// // };

// const testCollections = [
//   'root.request-log',
//   'root.limited-log',
//   'app.elections',
//   'app.ballots'
// ] as const;

// const withMockedEnv = mockEnvFactory({
//   NODE_ENV: 'test',
//   PRUNE_DATA_MAX_LOGS_BYTES: '100mb',
//   PRUNE_DATA_MAX_BANNED_BYTES: '10mb',
//   // * Step 2: Add new env var default values here
//   PRUNE_DATA_MAX_ELECTIONS_BYTES: '200mb',
//   PRUNE_DATA_MAX_BALLOTS_BYTES: '120mb'
// });

// const importPruneData = protectedImportFactory<
//   typeof import('externals/prune-data').default
// >({
//   path: 'externals/prune-data',
//   useDefault: true
// });

// setupMemoryServerOverride();
// useMockDateNow();

// /**
//  * Accepts one or more database and collection names in the form
//  * `database.collection` and returns the number of documents contained in each
//  * collection or the size of each collection in bytes depending on the value of
//  * `metric`.
//  */
// async function getCollectionSize(
//   collection: string,
//   { metric }: { metric: 'count' | 'bytes' }
// ): Promise<number>;
// async function getCollectionSize(
//   collections: readonly string[],
//   { metric }: { metric: 'count' | 'bytes' }
// ): Promise<Record<(typeof testCollections)[number], number>>;
// async function getCollectionSize(
//   collections: string | readonly string[],
//   { metric }: { metric: 'count' | 'bytes' }
// ): Promise<number | Record<string, number>> {
//   const targetCollections = [collections].flat();
//   const result = Object.assign(
//     {},
//     ...(await Promise.all(
//       targetCollections.map(async (dbCollection) => {
//         const [dbName, ...rawCollectionName] = dbCollection.split('.');

//         if (!dbName || rawCollectionName.length !== 1) {
//           throw new TrialError(`invalid input "${dbCollection}" to countCollection`);
//         }

//         const colDb = (await getDb({ name: dbName })).collection(rawCollectionName[0]);

//         if (metric === 'count') {
//           return colDb.countDocuments().then((count) => ({ [dbCollection]: count }));
//         } else if (metric === 'bytes') {
//           return colDb
//             .aggregate<{ size: number }>([
//               {
//                 $group: {
//                   _id: null,
//                   size: { $sum: { $bsonSize: '$$ROOT' } }
//                 }
//               }
//             ])
//             .next()
//             .then((r) => ({
//               [dbCollection]: r?.size ?? 0
//             }));
//         } else {
//           throw new ValidationError(`unknown metric "${metric}"`);
//         }
//       })
//     ))
//   );

//   const resultLength = Object.keys(result).length;

//   if (resultLength !== targetCollections.length) {
//     throw new TrialError('invalid output from countCollection');
//   }

//   return resultLength === 1 ? result[collections.toString()] : result;
// }

// it('is verbose when no DEBUG environment variable set and compiled NODE_ENV is not test', async () => {
//   expect.hasAssertions();

//   await withMockedOutput(async ({ infoSpy }) => {
//     await withMockedEnv(() => importPruneData({ expectedExitCode: 0 }), {
//       DEBUG: undefined,
//       NODE_ENV: 'something-else',
//       OVERRIDE_EXPECT_ENV: 'force-no-check'
//     });

//     expect(infoSpy.mock.calls.at(-1)?.[0]).toStrictEqual(
//       expect.stringContaining('execution complete')
//     );
//   });

//   await withMockedOutput(async ({ infoSpy }) => {
//     await withMockedEnv(() => importPruneData({ expectedExitCode: 0 }));
//     expect(infoSpy).not.toHaveBeenCalled();
//   });
// });

// it('rejects on bad environment', async () => {
//   expect.hasAssertions();

//   // * Step 3: Add new env vars emptiness tests below

//   // ? Remember that withMockedEnv is the result of calling a factory function
//   // ? with all the PRUNE_DATA_MAX_X env vars already defined.

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 2 }), {
//     PRUNE_DATA_MAX_LOGS_BYTES: '',
//     PRUNE_DATA_MAX_BANNED_BYTES: '',
//     PRUNE_DATA_MAX_BALLOTS_BYTES: '',
//     PRUNE_DATA_MAX_ELECTIONS_BYTES: ''
//   });

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 2 }), {
//     PRUNE_DATA_MAX_LOGS_BYTES: ''
//   });

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 2 }), {
//     PRUNE_DATA_MAX_BANNED_BYTES: ''
//   });

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 2 }), {
//     PRUNE_DATA_MAX_BALLOTS_BYTES: ''
//   });

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 2 }), {
//     PRUNE_DATA_MAX_ELECTIONS_BYTES: ''
//   });
// });

// // ? This is a bytes-based test. Look elsewhere for the old count-based tests!
// it('respects the limits imposed by PRUNE_DATA_MAX_X environment variables', async () => {
//   expect.hasAssertions();

//   const initialSizes = await getCollectionSize(testCollections, { metric: 'bytes' });

//   // * Step 4: Add new env vars low-prune-threshold tests below.

//   const expectedSizes = {
//     'root.request-log': initialSizes['root.request-log'] / 2,
//     'root.limited-log': initialSizes['root.limited-log'] / 2,
//     'app.elections': initialSizes['app.elections'] / 2,
//     'app.ballots': initialSizes['app.ballots'] / 2
//   };

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 0 }), {
//     PRUNE_DATA_MAX_LOGS_BYTES: String(expectedSizes['root.request-log']),
//     PRUNE_DATA_MAX_BANNED_BYTES: String(expectedSizes['root.limited-log']),
//     PRUNE_DATA_MAX_ELECTIONS_BYTES: String(expectedSizes['app.elections']),
//     PRUNE_DATA_MAX_BALLOTS_BYTES: String(expectedSizes['app.ballots'])
//   });

//   const newSizes = await getCollectionSize(testCollections, { metric: 'bytes' });

//   expect(newSizes['root.request-log']).toBeLessThanOrEqual(
//     expectedSizes['root.request-log']
//   );

//   expect(newSizes['root.limited-log']).toBeLessThanOrEqual(
//     expectedSizes['root.limited-log']
//   );

//   expect(newSizes['app.elections']).toBeLessThanOrEqual(expectedSizes['app.elections']);
//   expect(newSizes['app.ballots']).toBeLessThanOrEqual(expectedSizes['app.ballots']);

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 0 }), {
//     PRUNE_DATA_MAX_LOGS_BYTES: '1',
//     PRUNE_DATA_MAX_BANNED_BYTES: '1',
//     PRUNE_DATA_MAX_ELECTIONS_BYTES: '1',
//     PRUNE_DATA_MAX_BALLOTS_BYTES: '1'
//   });

//   const latestSizes = await getCollectionSize(testCollections, { metric: 'bytes' });

//   expect(latestSizes['root.request-log']).toBe(0);
//   expect(latestSizes['root.limited-log']).toBe(0);
//   expect(latestSizes['app.elections']).toBe(0);
//   expect(latestSizes['app.ballots']).toBe(0);
// });

// // ? This is a bytes-based test. Look elsewhere for the old count-based tests!
// it('only deletes entries if necessary', async () => {
//   expect.hasAssertions();

//   const initialSizes = await getCollectionSize(testCollections, { metric: 'bytes' });

//   await withMockedEnv(() => importPruneData({ expectedExitCode: 0 }), {
//     PRUNE_DATA_MAX_LOGS_BYTES: '100gb',
//     PRUNE_DATA_MAX_BANNED_BYTES: '100gb',
//     // * Step 5: Add new env vars high-prune-threshold values here
//     PRUNE_DATA_MAX_ELECTIONS_BYTES: '100gb',
//     PRUNE_DATA_MAX_BALLOTS_BYTES: '100gb'
//   });

//   const newSizes = await getCollectionSize(testCollections, { metric: 'bytes' });

//   expect(newSizes['root.request-log']).toBe(initialSizes['root.request-log']);
//   expect(newSizes['root.limited-log']).toBe(initialSizes['root.limited-log']);

//   expect(newSizes['app.elections']).toBe(initialSizes['app.elections']);
//   expect(newSizes['app.ballots']).toBe(initialSizes['app.ballots']);
// });

test.todo('this');
