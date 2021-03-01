export class CSV {
  private _data: string[][];

  constructor(data: string[][]) {
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

  // Return array of string values, or NULL if CSV string not well formed.
  parse(text: string): CSV {
    const lines = text.split(/\r\n|\n/);
    const result = lines.map(line => {
      const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
      const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

      // Return NULL if input string is not well formed CSV string.
      if (!re_valid.test(line)) return [];

      const a: string[] = []; // Initialize array to receive values.
      line.replace(re_value, // "Walk" the string using replace with callback.
        function(_m0, m1, m2, m3) {
          // Remove backslash from \' in single quoted values.
          if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

          // Remove backslash from \" in double quoted values.
          else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
          else if (m3 !== undefined) a.push(m3);
          return ''; // Return empty string.
        });

      // Handle special case of empty last value.
      if (/,\s*$/.test(line)) a.push('');

      return a;
    });

    return new CSV(result);
  }
}
