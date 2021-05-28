export class Cursor {
  constructor(row = 0, column = 0) {
    this.row = row;
    this.column = column;
  }

  static fromPos(text, pos) {
    const cursor = new Cursor();
    for (let i = 0; i < pos; i += 1) {
      if (text[i] === '\n') {
        cursor.row += 1;
        cursor.column = 0;
      } else {
        cursor.column += 1;
      }
    }
    return cursor;
  }

  toPos(text) {
    let pos = 0;
    const strings = text.split('\n');
    strings.slice(0, this.row).forEach((row) => { pos += row.length + 1; });
    pos += this.column;
    return pos;
  }

  gt(cursor) {
    if (this.row > cursor.row) {
      return true;
    }
    if (this.row > cursor.row) {
      return false;
    }

    return this.column > cursor.column;
  }

  eq(cursor) {
    return this.row === cursor.row && this.column === cursor.column;
  }
}

export const DOWNLOAD_STATE = {
  NEED_DOWNLOAD: 0,
  DOWNLOADING: 1,
  DOWNLOAD: 2,
  FAIL: 3,
};

export function openPage(page) {
  if (page[0] !== '/') page = `/${page}`;
  window.location.href = window.location.origin + page;
}

export function downloadFile(data, name) {
  const a = document.createElement('a');
  const file = new Blob([data]);
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
}
