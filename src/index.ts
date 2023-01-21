import express, { Request, Response } from 'express'

const app = express()
const port = 3000
const jsonMiddleWare = express.json()
app.use(jsonMiddleWare)

type CourseType = {
  id: number
  title: string
}

type dateBase = {
  courses: Array<CourseType>
}

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

const db: dateBase = {
  courses: [
    {id:1, title: 'front-end'},
    {id:2, title: 'back-end'},
    {id:3, title: 'devOps'},
    {id:4, title: 'QA'}
  ]
}

app.get('/', (req: Request, res: Response) => {
  const a = 4
  if (a > 5) {
    res.send('OK!')
  } else {
    res.send('Hello World!')
  }
})

app.get('/courses', (req: Request, res: Response) => {
  let foundCourses = db.courses
  if(req.query.title) {
    foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
  }

  res.json(foundCourses)
})

app.get('/courses/:id', (req: Request, res: Response) => {
  const foundCours = db.courses.find(course => course.id === +req.params.id)
  if(!foundCours) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }
  
  res.json(foundCours)
})


app.post('/courses', (req: Request, res: Response) => {
  if(!req.body.title || req.body.title === ' ') {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return
  }

  const addedCourse = {
    id: +(new Date()),
    title: req.body.title
  }
  db.courses.push(addedCourse)
  
  res.status(HTTP_STATUSES.CREATED_201).json('course ' + addedCourse.title + ' added')
})

app.delete('/courses/:id', (req: Request, res: Response) => {
  const reqID = +req.params.id
  db.courses = db.courses.filter(c => c.id !== reqID)

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.put('/courses/:id', (req: Request, res: Response) => {

  if(!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return;
  }

  const foundCours = db.courses.find(course => course.id === +req.params.id)

  if(!foundCours) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return;
  }
  foundCours.title = req.body.title
  
  res.json(foundCours)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
