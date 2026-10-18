import http from 'node:http'

try {
  process.loadEnvFile('.env.local')
} catch {
  // Missing file is fine; the handler reports a missing key generically.
}

const { default: questHandler } = await import('./api/quest.js')

const PORT = 3000
const MAX_BODY = 16 * 1024

function sendJson(res, status, payload, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers })
  res.end(JSON.stringify(payload))
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')

  if (pathname !== '/api/quest') {
    return sendJson(res, 404, { error: 'Not found.' })
  }
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' })
  }

  let size = 0
  let tooLarge = false
  const chunks = []

  req.on('data', (chunk) => {
    if (tooLarge) return
    size += chunk.length
    if (size > MAX_BODY) {
      tooLarge = true
      sendJson(res, 413, { error: 'Request body too large.' }, { Connection: 'close' })
      req.resume()
      return
    }
    chunks.push(chunk)
  })

  req.on('end', async () => {
    if (tooLarge) return
    // Adapt node:http objects to the (req, res) shape the handler expects.
    const adaptedReq = { method: req.method, body: Buffer.concat(chunks).toString('utf8') }
    const adaptedRes = {
      setHeader: (k, v) => res.setHeader(k, v),
      status(code) {
        res.statusCode = code
        return this
      },
      json(payload) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(payload))
      },
    }
    try {
      await questHandler(adaptedReq, adaptedRes)
    } catch {
      if (!res.headersSent) sendJson(res, 500, { error: 'Unexpected server error.' })
    }
  })

  req.on('error', () => {
    if (!res.headersSent) sendJson(res, 400, { error: 'Bad request.' })
  })
})

server.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
