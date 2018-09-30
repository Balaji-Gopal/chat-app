import { FilterPipe } from './filter.pipe';
const content = require('../assets/randomuser.json');

describe('FilterPipe', () => {
    let pipe: FilterPipe;

    beforeEach(() => {
        pipe = new FilterPipe();
    });

    /**
     * Test case to search item okan
     */
    it('transforms only items based on search string', function() {
        expect(pipe.transform(content.results, 'okan').toString()).toBe(content.results[0].toString());
    });

    /**
     * Test case to search item okan which is entered in jumbled up font case
     */
    it('transforms only items based on search string even if it in differnt font case', function() {
        expect(pipe.transform(content.results, 'OkAn').toString()).toBe(content.results[0].toString());
    });

    /**
     * Test case to search item which is not there in the list
     */
    it('transforms only items based on search string which is not there in the list', function() {
        expect(pipe.transform(content.results, 'nothing').toString()).toBe('');
    });
});
