import { SyncHook, AsyncSeriesHook } from 'tapable';
import webpack from 'webpack';
import { sync } from '../../shopify/sync';
export interface ClientHooks {
  beforeSync:AsyncSeriesHook<(string[] | webpack.Stats)[]>,
  sync:SyncHook<(string[] | webpack.Stats)[]>,
  syncDone:SyncHook<(string[] | webpack.Stats)[]>,
  afterSync:AsyncSeriesHook<(string[] | webpack.Stats)[]>,
  syncSkipped:SyncHook<(string[] | webpack.Stats)[]>
}

export class MiddlewareHooks {
  public files:string[];
  public skipSync:boolean;
  public skipNextSync: boolean;
  public hooks: ClientHooks;
  
  constructor() {
    this.files = [];
    this.skipSync = false;
    this.hooks = {
      beforeSync: new AsyncSeriesHook([ 'files', 'stats' ]),
      sync: new SyncHook([ 'files', 'stats' ]),
      syncDone: new SyncHook([ 'files', 'stats' ]),
      afterSync: new AsyncSeriesHook([ 'files','stats' ]),
      syncSkipped: new SyncHook([ 'files', 'stats']),
    };

    this.skipNextSync = false;
  }

  async sync(files: string[], stats: webpack.Stats) {
    this.files = files;

    await this.hooks.beforeSync.promise(this.files, stats);

    if (this.files.length === 0) {
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
    this.skipNextSync = false;
  }
};