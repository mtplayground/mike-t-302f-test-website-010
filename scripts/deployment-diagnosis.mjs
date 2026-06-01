import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const distIndexPath = new URL('../dist/index.html', import.meta.url);
const deploymentUrl = process.env.DEPLOYMENT_URL ?? process.argv[2];
const expectedMarkers = ['myClawTeam', 'id="features"', 'id="community"', 'id="contact"', '<main id="main-content"'];
const spritePlaceholderMarkers = ['Sprite Deployment', 'fresh Sprite microVM', 'Application status: operational'];
const failures = [];

const runGit = async (args) => {
  try {
    const { stdout } = await execFileAsync('git', args, {
      cwd: new URL('..', import.meta.url),
      timeout: 5000,
    });

    return stdout.trim();
  } catch {
    return 'unavailable';
  }
};

const analyzeHtml = (label, html) => {
  const missingExpectedMarkers = expectedMarkers.filter((marker) => !html.includes(marker));
  const foundPlaceholderMarkers = spritePlaceholderMarkers.filter((marker) => html.includes(marker));

  return {
    label,
    bytes: Buffer.byteLength(html),
    missingExpectedMarkers,
    foundPlaceholderMarkers,
    hasExpectedSite: missingExpectedMarkers.length === 0,
    hasSpritePlaceholder: foundPlaceholderMarkers.length > 0,
  };
};

const fetchDeploymentHtml = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'text/html',
      },
      signal: controller.signal,
    });

    const html = await response.text();

    return {
      status: response.status,
      finalUrl: response.url,
      html,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const printAnalysis = (analysis) => {
  console.log(`${analysis.label}:`);
  console.log(`- HTML bytes: ${analysis.bytes}`);
  console.log(`- Expected myClawTeam markers present: ${analysis.hasExpectedSite ? 'yes' : 'no'}`);
  console.log(`- Sprite placeholder detected: ${analysis.hasSpritePlaceholder ? 'yes' : 'no'}`);

  if (analysis.missingExpectedMarkers.length > 0) {
    console.log(`- Missing markers: ${analysis.missingExpectedMarkers.join(', ')}`);
  }

  if (analysis.foundPlaceholderMarkers.length > 0) {
    console.log(`- Placeholder markers: ${analysis.foundPlaceholderMarkers.join(', ')}`);
  }
};

const branch = await runGit(['branch', '--show-current']);
const commit = await runGit(['rev-parse', 'HEAD']);

console.log('Deployment diagnosis');
console.log(`- Local branch: ${branch}`);
console.log(`- Local commit: ${commit}`);
console.log('- Expected build output directory: dist/');

if (!existsSync(distIndexPath)) {
  failures.push('dist/index.html does not exist. Run npm run build before diagnosing the deployment output.');
} else {
  const localHtml = await readFile(distIndexPath, 'utf8');
  const localAnalysis = analyzeHtml('Local dist/index.html', localHtml);
  printAnalysis(localAnalysis);

  if (!localAnalysis.hasExpectedSite) {
    failures.push('Local dist/index.html is missing expected myClawTeam page markers.');
  }

  if (localAnalysis.hasSpritePlaceholder) {
    failures.push('Local dist/index.html contains Sprite placeholder content.');
  }
}

if (deploymentUrl) {
  try {
    const deployed = await fetchDeploymentHtml(deploymentUrl);
    const deployedAnalysis = analyzeHtml(`Deployment URL (${deployed.finalUrl}, status ${deployed.status})`, deployed.html);
    printAnalysis(deployedAnalysis);

    if (!deployedAnalysis.hasExpectedSite) {
      failures.push('Deployment URL is not serving the expected myClawTeam Astro page.');
    }

    if (deployedAnalysis.hasSpritePlaceholder) {
      failures.push('Deployment URL is serving the Sprite placeholder, which means the host is not serving Astro dist/.');
    }
  } catch (error) {
    failures.push(`Could not fetch deployment URL: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  console.log('Deployment URL: not provided. Set DEPLOYMENT_URL or pass the URL as the first argument.');
}

if (failures.length > 0) {
  console.error('Deployment diagnosis failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log('Deployment diagnosis passed.');
