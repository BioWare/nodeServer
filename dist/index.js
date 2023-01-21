"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const jsonMiddleWare = express_1.default.json();
app.use(jsonMiddleWare);
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'devOps' },
        { id: 4, title: 'QA' }
    ]
};
app.get('/', (req, res) => {
    const a = 4;
    if (a > 5) {
        res.send('OK!');
    }
    else {
        res.send('Hello World!');
    }
});
app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
    const foundCours = db.courses.find(course => course.id === +req.params.id);
    if (!foundCours) {
        res.sendStatus(404);
    }
    res.json(foundCours);
});
app.post('/courses', (req, res) => {
    if (!req.body.title || req.body.title === ' ') {
        res.sendStatus(400);
        return;
    }
    const addedCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(addedCourse);
    res.status(201).json('course ' + addedCourse.title + ' added');
});
app.delete('/courses/:id', (req, res) => {
    const reqID = +req.params.id;
    db.courses = db.courses.filter(c => c.id !== reqID);
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
