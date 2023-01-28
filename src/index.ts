import express, { Request, Response } from 'express'
import { CreateCourseModule } from './modules/CreateCourseModule'
import { GetCoursesQueryModule } from './modules/GetCoursesQueryModule'
import { UpdateCourseModule } from './modules/UpdateCourseModule'
import { URIParamsIdCoursesModule } from './modules/URIParamsIdCoursesModule'
import { ViewCourseModule } from './modules/ViewCourseModule'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types'

export const app = express()
const port = 3000
const jsonMiddleWare = express.json()
app.use(jsonMiddleWare)

type CourseType = {
  id: number
  title: string
  studentsCount: number
}

type statusesType = {
  OK_200: number
  CREATED_201: number
  NO_CONTENT_204: number

  BAD_REQUEST_400: number
  NOT_FOUND_404: number
}

export const HTTP_STATUSES: statusesType = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

const db: { courses: CourseType[] } = {
  courses: [
    {id:1, title: 'front-end', studentsCount: 10},
    {id:2, title: 'back-end', studentsCount: 10},
    {id:3, title: 'devOps', studentsCount: 10},
    {id:4, title: 'QA', studentsCount: 10}
  ]
}

const getViewModule = (course: CourseType): ViewCourseModule => {
      return {
        id: course.id,
        title: course.title
      }
}

app.get('/courses', (req: RequestWithQuery<GetCoursesQueryModule>,
                    res: Response<ViewCourseModule[]>) => {
  let foundCourses = db.courses
  if(req.query.title) {
    foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)
  }

  res.json(foundCourses.map(getViewModule))
})

app.get('/courses/:id', (req: RequestWithParams<URIParamsIdCoursesModule>, res: Response<ViewCourseModule>) => {
  const foundCours = db.courses.find(course => course.id === +req.params.id)
  if(!foundCours) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  res.json(foundCours)
})


app.post('/courses', (req: RequestWithBody<CreateCourseModule>, res: Response<ViewCourseModule>) => {
  if(!req.body.title || req.body.title === ' ') {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    return
  }

  const addedCourse: CourseType = {
    id: +(new Date()),
    title: req.body.title,
    studentsCount: 0
  }
  db.courses.push(addedCourse)
  
  res.status(HTTP_STATUSES.CREATED_201)
    .json(getViewModule(addedCourse))
})

app.delete('/courses/:id', (req: RequestWithParams<URIParamsIdCoursesModule>, res: Response) => {
  const reqID = +req.params.id
  db.courses = db.courses.filter(c => c.id !== reqID)

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsIdCoursesModule, UpdateCourseModule>, res: Response) => {

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
  
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/__test__/data', (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
