import portscanner from 'portscanner';

/**
 * Finds a series of available ports of length quantity, starting at a given
 * port number and incrementing up. Returns an array of port numbers.
 */
export const getAvailablePortSeries = async (start:number,quantity:number,increment = 1) => {
  let startPort = start;
  let endPort = start + (quantity - 1);

  const ports:number[] = [];

  const scan = (start:number, end:number) => new Promise<number|null>((r,r2)=>{
    portscanner.findAPortInUse(start, end, '127.0.0.1', (error,port) => {
      if(typeof port === "number") return r(port);
      if(error) return r2(error);
      r(null);
    });
  });

  while(true) { 
    let result = await scan(startPort, endPort);
    let end = typeof result === "number" ? result : endPort;
    for(let i = startPort; i <= end; i++) ports.push(i);

    if(typeof result === "number") {
      startPort = result;
    } else {
      break;
    }
  }
  
  return ports; 
}