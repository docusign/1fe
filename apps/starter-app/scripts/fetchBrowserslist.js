import { writeFile } from 'fs/promises';

const ENVIRONMENT = process.env.NODE_ENV === 'development' ? 'integration' : (process.env.NODE_ENV || 'production');
const CDN_URL = `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/live.json`;
const DEST_FILE = '.browserslistrc';

async function fetchAndWriteBrowserslist() {
  try {
    console.log(`Fetching browserslist from ${CDN_URL}...`);
    const res = await fetch(CDN_URL);
    const runtimeConfigs = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to fetch browserslist: ${res.status} ${res.statusText}`);
    }
    const browserslistconfig = runtimeConfigs?.platform?.browserslistConfig?.buildTarget;

    console.log(runtimeConfigs);
    if (browserslistconfig) {
      const config = browserslistconfig.join('\n'); // assuming an array of queries
      await writeFile(DEST_FILE, config);
      console.log(`Browserslist config saved to ${DEST_FILE}`);
    } else {
      throw new Error('Browserslist config not found in the fetched data');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch and write browserslist: ${error.message}`);
    process.exit(1); // Exit with failure
  }
}

fetchAndWriteBrowserslist();