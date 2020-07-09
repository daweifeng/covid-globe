export class CSV {
  private _data: string[][] | undefined;

  constructor(data?: string[][]) {
    this._data = data;
  }

  get header(): string[] {
    if (typeof this._data !== 'undefined') {
      return this._data[0];
    }
    return [];
  }

  get data() {
    return this._data;
  }

}

export class CSVParser {
  parse(csvTxt: string): CSV {
    const allLines = csvTxt.split(/\r\n|\n/);
    const lineArr = allLines.map(line => line.split(','));

    return new CSV(lineArr);
  }
}
