/**
 * Creates a request animation frame listener. Returns tools to start and stop
 * the raf. Raf will already be asked to invoke next frame.
 * 
 * @param p Params about the raf.
 * @returns The raf tool to stop and start on the fly.
 */
export const rafListen = (p:{ callback:()=>void }) => {
  let active = false;

  const wrapped = () => {
    if(!active) return;
    requestAnimationFrame(wrapped);
    p.callback();
  }
  requestAnimationFrame(wrapped);

  return {
    pause: () => {
      active = false;
    },

    resume: () => {
      if(!active) requestAnimationFrame(wrapped);
      active = true;
    }
  }
}