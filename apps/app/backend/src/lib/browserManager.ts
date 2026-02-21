import puppeteer, { Browser } from "puppeteer-core";

let browserInstance: Browser | null = null;
let browserPromise: Promise<Browser> | null = null;

async function launchBrowser(): Promise<Browser> {
  if (process.env.BROWSER_WS_ENDPOINT) {
    console.log("Connecting to Browserless...");
    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
    });
    console.log("Connected to Browserless successfully!");
    browser.on("disconnected", () => {
      console.log("Browser disconnected — will reconnect on next request.");
      browserInstance = null;
      browserPromise = null;
    });
    return browser;
  }

  console.log("Launching local Chrome...");
  const browser = await puppeteer.launch({
    headless: true as const,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  console.log("Local Chrome launched successfully!");
  browser.on("disconnected", () => {
    console.log("Browser disconnected — will relaunch on next request.");
    browserInstance = null;
    browserPromise = null;
  });
  return browser;
}

/**
 * Returns a shared Browser instance, launching or connecting one if needed.
 * Concurrent callers during startup all await the same promise to prevent
 * multiple launches racing each other.
 */
export async function getBrowser(): Promise<Browser> {
  if (browserInstance?.connected) {
    return browserInstance;
  }

  if (!browserPromise) {
    browserPromise = launchBrowser()
      .then((b) => {
        browserInstance = b;
        browserPromise = null;
        return b;
      })
      .catch((err) => {
        browserPromise = null;
        throw err;
      });
  }

  return browserPromise;
}

/**
 * Closes the shared browser instance. Call this on process shutdown to
 * release the Chrome process or Browserless connection cleanly.
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    browserPromise = null;
    console.log("Browser closed.");
  }
}
