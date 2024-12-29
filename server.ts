import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { WebSocketManager } from './server/websocket'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3001

// Prepare Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })

  // Initialize WebSocket server
  new WebSocketManager(server)

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
