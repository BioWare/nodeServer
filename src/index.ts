import express, { Request, Response } from 'express'
const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  const a = 4
  if (a > 5) {
    res.send('OK!')
  } else {
    res.send('Hello World!')
  }
})

app.get('/about', (req: Request, res: Response) => {
  res.send('./pages/about.html')
})

app.post('/about', (req: Request, res: Response) => {
  res.send('Wo added some info!!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
