import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const html = readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

setTimeout(() => {
  const window = dom.window;
  
  if (window.generateAutoBuild) {
     console.log("Testing 1800 USD (1440p)...");
     window.generateAutoBuild(1800, '1440p', 'all', 'all');
     console.log("CPU:", window.buildState.cpu.name);
     console.log("GPU:", window.buildState.gpu.name);
     console.log("MB:", window.buildState.motherboard.name);
     console.log("PSU:", window.buildState.psu.name);
  } else {
     console.log("No generateAutoBuild found on window");
  }
}, 1000);
