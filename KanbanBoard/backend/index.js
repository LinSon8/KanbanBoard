const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


function getTIdCounter() {
    let tempId = "";
    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns[i].tasks.length; j++) {
            if (columns[i].tasks[j].id > tempId) {
                tempId = columns[i].tasks[j].id;
            }
        }
    }
    let letter = tempId.match(/[a-zA-Z]+/)[0];
    let number = tempId.match(/\d+/)[0];
    return ++number;
}

///////////////////////////
// Data initialization
///////////////////////////

//TODO: implement (see 6.1.1)
const app = express();
const tags = require('./data/tags.json');
var columns = require('./data/columns.json');

//let taskIdCounter = 't' + getTIdCounter();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.locals.tags = tags;
    res.locals.columns = columns;
    res.locals.taskIdCounter = "t" + getTIdCounter();
    next();
});

///////////////////////////
// Server setup
///////////////////////////

//TODO: implement (see 6.1.2)
const port = 3000;
app.use(express.static(path.join(__dirname, '../frontend/dist')));
//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
//});

///////////////////////////
// CRUD operations
///////////////////////////

//TODO: implement (see 6.1.3 - 6.1.9)
app.get('/api/counter', (req, res) => {
    res.status(200).send(JSON.stringify({ "taskIdCounter": res.locals.taskIdCounter }));
});

app.get('/api/tags', (req, res) => {
    res.status(200).send(JSON.stringify(res.locals.tags));
});

app.get('/api/columns', (req, res) => {
    res.status(200).send(JSON.stringify(res.locals.columns));
});

app.post('/api/tasks', (req, res) => {
    const { column, title, text, taskTags } = req.body;

    const newTask = {
        "id": res.locals.taskIdCounter,
        "title": title,
        "text": text,
        "tags": taskTags
    }
    columns[column].tasks.push(newTask);

    res.status(201).send(JSON.stringify(res.locals.taskIdCounter));
});

app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, text, taskTags} = req.body;
    let flag = -1;

    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns[i].tasks.length; j++) {
            if (columns[i].tasks[j].id == taskId) {
                columns[i].tasks[j].title = title;
                columns[i].tasks[j].text = text;
                columns[i].tasks[j].tags = taskTags;
                flag = 1;
            }
        }
    }

    if (flag == 1) res.status(200).send("Task aktualisiert");
    else res.status(404).send("Task nicht gefunden");
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    let flag = -1;

    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns[i].tasks.length; j++) {
            if (columns[i].tasks[j].id == taskId) {
                columns[i].tasks.splice(j, 1);
                flag = 1;
            }
        }
    }

    if (flag == 1) res.status(200).send("Task gelöscht");
    else res.status(404).send("Task nicht gefunden");
});

app.put('/api/move-task/:id', (req, res) => {
    const taskId = req.params.id;
    const newColId = req.body.newColumnId;
    let tempTask = {};
    let flag = -1;

    if ((newColId >= 0) && (newColId < columns.length)) {
        for (let i = 0; i < columns.length; i++) {
            for (let j = 0; j < columns[i].tasks.length; j++) {
                if (columns[i].tasks[j].id == taskId) {
                    tempTask = columns[i].tasks.splice(j, 1)[0];
                    flag = 1;
                }
            }
        }
        

        if (flag == 1) {
            columns[newColId].tasks.push(tempTask);
            res.status(200).send("Task verschoben");
        }
        else res.status(404).send("Task oder Zielspalte nicht gefunden");
    }
});

///////////////////////////
// Start the server
///////////////////////////

//TODO: implement (see 6.1.2)
app.listen(port, () => console.log(`Server listening on port ${port}`));