import {replaceParams} from './replaceParams';

describe('replaceParams', () => {
    test('should replace url path params', () => {
        expect(replaceParams('v1/applications/:appIdOrName', {appIdOrName: 1})).toBe('v1/applications/1');
    });
});
