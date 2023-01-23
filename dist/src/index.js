"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 3000;
const jsonMiddleWare = express_1.default.json();
exports.app.use(jsonMiddleWare);
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'devOps' },
        { id: 4, title: 'QA' }
    ]
};
exports.app.get('/', (req, res) => {
    const a = 4;
    if (a > 5) {
        res.send('OK!');
    }
    else {
        res.send('Hello World!');
    }
});
exports.app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
exports.app.get('/courses/:id', (req, res) => {
    const foundCours = db.courses.find(course => course.id === +req.params.id);
    if (!foundCours) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(foundCours);
});
exports.app.post('/courses', (req, res) => {
    if (!req.body.title || req.body.title === ' ') {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const addedCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(addedCourse);
    res.status(exports.HTTP_STATUSES.CREATED_201).json('course ' + addedCourse.title + ' added');
});
exports.app.delete('/courses/:id', (req, res) => {
    const reqID = +req.params.id;
    db.courses = db.courses.filter(c => c.id !== reqID);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const foundCours = db.courses.find(course => course.id === +req.params.id);
    if (!foundCours) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCours.title = req.body.title;
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
