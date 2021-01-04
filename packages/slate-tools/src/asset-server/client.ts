import { SyncHook, AsyncSeriesHook } from 'tapable';
import { sync } from '@process-creative/slate-sync';

type ClientOptions = {
} & any;

export class Client {
  public options:ClientOptions;
  public files:string[];
  public skipSync:boolean;
  public hooks:{
    beforeSync:any,
    sync:any,
    syncDone:any,
    afterSync:any,
    syncSkipped:any
  };

  constructor(options?:ClientOptions) {
    this.options = { ...(options||{}) };
    this.files = [];
    this.skipSync = false;
    this.hooks = {
      //@ts-ignore
      beforeSync: new AsyncSeriesHook([ 'files', 'stats' ]),
      //@ts-ignore
      sync: new SyncHook([ 'files', 'stats' ]),
      //@ts-ignore
      syncDone: new SyncHook([ 'files', 'stats' ]),
      //@ts-ignore
      afterSync: new AsyncSeriesHook([ 'files','stats' ]),
      //@ts-ignore
      syncSkipped: new SyncHook([ 'files', 'stats']),
    };

    //@ts-ignore
    this.skipNextSync = false;
  }

  async sync(files, stats) {
    this.files = files;

    await this.hooks.beforeSync.promise(this.files, stats);

    if (this.files.length === 0) {
      //@ts-ignore
      this.skipNextSync = true;
    }

    if (this.skipNextSync) {
      this.hooks.syncSkipped.call(this.files, stats);
    } else {
      this.hooks.sync.call(this.files, stats);
      await sync(this.files);
      this.hooks.syncDone.call(this.files, stats);
    }

    this.hooks.afterSync.promise(this.files, stats);

    //@ts-ignore
    this.skipNextSync = false;
  }

  skipNextSync() {
    this.skipSync = true;
  }
};

exports = Client;