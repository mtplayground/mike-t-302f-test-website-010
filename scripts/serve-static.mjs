import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const defaultHost = '0.0.0.0';
const defaultPort = 8080;
const rootDirectory = resolve(process.env.STATIC_ROOT ?? new URL('../dist/', import.meta.url).pathname);
const host = process.env.HOST ?? defaultHost;
const port = Number.parseInt(process.env.PORT ?? String(defaultPort), 10);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

const sendText = (response, statusCode, message) => {
  response.writeHead(statusCode, {
    'content-type': 'text/plain; charset=utf-8',
    'x-content-type-options': 'nosniff',
  });
  response.end(`${message}\n`);
};

const resolveRequestPath = (requestUrl) => {
  const url = new URL(requestUrl ?? '/', 'http://localhost');
  const decodedPath = decodeURIComponent(url.pathname);
  const normalizedPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const relativePath = normalizedPath === sep ? 'index.html' : normalizedPath.replace(/^[/\\]/, '');
  const filePath = resolve(join(rootDirectory, relativePath));
  const rootWithSeparator = rootDirectory.endsWith(sep) ? rootDirectory : `${rootDirectory}${sep}`;

  if (filePath !== rootDirectory && !filePath.startsWith(rootWithSeparator)) {
    return undefined;
  }

  return filePath;
};

const resolveFilePath = async (requestUrl) => {
  const requestedPath = resolveRequestPath(requestUrl);

  if (!requestedPath) {
    return undefined;
  }

  try {
    const fileStats = await stat(requestedPath);

    if (fileStats.isDirectory()) {
      const indexPath = join(requestedPath, 'index.html');
      const indexStats = await stat(indexPath);
      return indexStats.isFile() ? indexPath : undefined;
    }

    return fileStats.isFile() ? requestedPath : undefined;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid PORT value: ${process.env.PORT}`);
  process.exit(1);
}

if (!existsSync(join(rootDirectory, 'index.html'))) {
  console.error(`Cannot serve static site: ${join(rootDirectory, 'index.html')} does not exist.`);
  console.error('Run npm run build before npm start.');
  process.exit(1);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, {
      allow: 'GET, HEAD',
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
    });
    response.end('Method not allowed\n');
    return;
  }

  try {
    const filePath = await resolveFilePath(request.url);

    if (!filePath) {
      sendText(response, 404, 'Not found');
      return;
    }

    const extension = extname(filePath).toLowerCase();
    const headers = {
      'cache-control': filePath.includes(`${sep}_astro${sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
      'content-type': contentTypes.get(extension) ?? 'application/octet-stream',
      'x-content-type-options': 'nosniff',
    };

    response.writeHead(200, headers);

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    const stream = createReadStream(filePath);
    stream.on('error', (error) => {
      console.error(`Error reading ${filePath}:`, error);

      if (!response.headersSent) {
        sendText(response, 500, 'Internal server error');
      } else {
        response.destroy(error);
      }
    });
    stream.pipe(response);
  } catch (error) {
    console.error('Static server request failed:', error);
    sendText(response, 500, 'Internal server error');
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${rootDirectory} at http://${host}:${port}/`);
});
