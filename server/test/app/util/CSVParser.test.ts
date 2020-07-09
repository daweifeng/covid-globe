import * as assert from 'assert';
import { CSV, CSVParser } from '../../../app/util/CSVParser';

describe('test/app/util/CSVParser.test.js', () => {

  it('CSV class header', () => {
    const data = [
      [ 'name', 'school' ],
      [ 'David', 'UC Berkeley' ],
    ];

    const csv = new CSV(data);

    assert(csv.header[0] === data[0][0]);
    assert(csv.header[1] === data[0][1]);
  });

  it('CSVParser parse', () => {
    const str = 'name,school\nDavid,UC Berkeley';

    const csvParser = new CSVParser();
    const csv = csvParser.parse(str);

    assert(csv.header[0] === 'name');
    assert(csv.header[1] === 'school');
  });
});
