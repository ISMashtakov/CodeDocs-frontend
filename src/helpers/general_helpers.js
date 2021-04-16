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

export function getAllPairs(list) {
  const pairs = [];
  for (let i = 0; i < list.length; i += 1) {
    for (let j = 0; j < list.length; j += 1) {
      pairs.push([list[i], list[j]]);
    }
  }
  return pairs;
}

export class QueueActions {
  constructor() {
    this.queue = [];
    this.isRun = false;
  }

  run() {
    if (this.isRun) return;

    this.isRun = true;
    while (this.queue.length > 0) {
      const { queue } = this;
      queue.forEach((item) => item());
      this.queue = this.queue.slice(queue.length);
    }
    this.isRun = false;
  }

  add(action) {
    this.queue.push(action);
    this.run();
  }

  clean() {
    this.queue = [];
  }
}
