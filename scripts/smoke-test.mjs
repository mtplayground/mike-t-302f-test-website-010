import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = new URL('../dist/', import.meta.url);
const indexPath = new URL('index.html', distDir);
const faviconPath = new URL('favicon.svg', distDir);

const failures = [];

const check = (condition, message) => {
  if (!condition) {
    failures.push(message);
  }
};

const readText = async (url) => readFile(url, 'utf8');

const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
};

check(existsSync(indexPath), 'dist/index.html was not generated.');
check(existsSync(faviconPath), 'dist/favicon.svg was not generated.');

const html = existsSync(indexPath) ? await readText(indexPath) : '';

for (const target of ['features', 'community', 'contact']) {
  check(html.includes(`id="${target}"`), `Missing #${target} section target.`);
  check(html.includes(`href="#${target}"`), `Missing link to #${target}.`);
}

check(html.includes('<header'), 'Missing navigation header.');
check(html.includes('<main id="main-content"'), 'Missing main content landmark.');
check(html.includes('<footer'), 'Missing footer.');

check(html.includes('data-contact-form'), 'Missing contact form marker.');
check(html.includes('name="name"'), 'Missing contact name field.');
check(html.includes('name="email"'), 'Missing contact email field.');
check(html.includes('name="message"'), 'Missing contact message field.');
check(html.includes('data-form-status'), 'Missing contact form status element.');

const formActionMatch = html.match(/<form[^>]+action="([^"]+)"/);
const formModeMatch = html.match(/<form[^>]+data-submission-mode="([^"]+)"/);
const formAction = formActionMatch?.[1] ?? '';
const formMode = formModeMatch?.[1] ?? '';

check(Boolean(formAction), 'Contact form action is empty.');
check(formMode === 'mailto' || formMode === 'service', 'Contact form submission mode is invalid.');

if (formMode === 'mailto') {
  check(formAction.startsWith('mailto:'), 'Mailto fallback form action is not a mailto URL.');
}

const builtFiles = existsSync(distDir) ? await collectFiles(distDir.pathname) : [];
const builtJavaScript = (
  await Promise.all(
    builtFiles
      .filter((file) => file.endsWith('.js'))
      .map((file) => readFile(file, 'utf8')),
  )
).join('\n');
const executableOutput = `${html}\n${builtJavaScript}`;

for (const expectedString of [
  'This field is required.',
  'Enter a valid email address.',
  'Message sent successfully.',
  'Your email client is opening with the message details.',
]) {
  check(executableOutput.includes(expectedString), `Missing validation/submission string: ${expectedString}`);
}

if (failures.length > 0) {
  console.error('Smoke test failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log('Smoke test passed.');
