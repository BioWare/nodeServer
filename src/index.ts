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
    res.sendStatus(404)
  }
  
  res.json(foundCours)
})


app.post('/courses', (req: Request, res: Response) => {
  if(!req.body.title || req.body.title === ' ') {
    res.sendStatus(400)
    return
  }

  const addedCourse = {
    id: +(new Date()),
    title: req.body.title
  }
  db.courses.push(addedCourse)
  
  res.json('course ' + addedCourse + ' added')
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
