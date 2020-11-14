const express = require('express');
const Datastore = require('nedb');
const app = express();

const database = new Datastore('database.db');

database.loadDatabase();

app.listen(3000,() => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json());

app.post('/api', (request,response) => {
    const data = request.body;

    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);

    response.json({
        status: "success",
        timestamp: timestamp,
        message: data
    });
});

app.post('/delete', (request,response) => {
    const data = request.body;
    database.remove({taskDescription: data.delete},{},(err,n)=>{
        response.json({
            status: "success",
            removed: n
        });
    });

    
});

app.post('/update',(request,response)=>{
    const data = request.body;
    database.update({taskDescription: data.update}, { $set: { important: true } }, {}, function (err, n) {
        console.log(data);
        console.log(n);
        // numReplaced = 3
        // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
        response.json({
            status: "success",
            updated: n
        });
    });
});

app.get('/task',(request,response)=>{
    const subject = request.query.s;
    let sorting = request.query.so;


    sorting = JSON.parse(sorting);
    if( subject=="All"){
        database.find({}).sort(sorting).exec((err,data)=> {
            response.json(data);
        });
    }else{
        database.find({subject: subject}).sort(sorting).exec((err,data)=> {
            response.json(data);
        });
    }
    
});

 /*
 
 {
    taskName: taskName,
    taskDescription: description,
    resources: isResources,
    important: isImportant,
    teacher: teacher,
    subject: subject,
    dateAssigned: dateAssigned,
    dateDue: dateDue,
    duration: duration
}
 */ 