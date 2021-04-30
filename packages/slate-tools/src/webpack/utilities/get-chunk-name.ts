import * as crypto  from 'crypto';
import { Chunk } from '../server/asset-server';

export const chunkGetName = (module:string, chunks:Chunk[], cacheGroup:string) => {
  let containsLayout = false;

  const names = chunks.map((chunk) => {
    if (chunk.name.includes('layout.')) {
      containsLayout = true;
    }
    return chunk.name;
  }).filter((name) => {
    return !containsLayout || (containsLayout && name.includes('layout.'));
  });
  if (!names.every(e=>e)) return;

  names.sort();

  let name = (
    (cacheGroup && cacheGroup !== 'default' ? `${cacheGroup}_` : '') +
    names.join('_')
  );

  // Filenames and paths can't be too long otherwise an
  // ENAMETOOLONG error is raised. If the generated name is too
  // long, it is truncated and a hash is appended. The limit has
  // been set to 100 to prevent `[name].[chunkhash].[ext]` from
  // generating a 256+ character string.
  if (name.length > 150) name = `${name.slice(0, 140)}~${hashFilename(name)}`;
  return name;
};

const hashFilename = (name:string) => (
  crypto
    .createHash('md4')
    .update(name)
    .digest('hex')
    .slice(0, 8)
)