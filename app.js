const express = require('express');

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
const date = require(__dirname + '/date.js');

const items = [];
const workItems = [];


app.get('/', (req, res) => {
    const day = date.getDay();
    res.render('list', { listTitle: day, items: items});
});

app.post('/', (req, res) => {
    console.log(req.body);
    const item = req.body.item;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }
})

app.get('/work', (req, res) => {
    res.render('list', { listTitle: 'Work', items: workItems});
});

app.get('/about', (req, res) => {
    res.render('about');
})

app.listen(port, function () {
    console.log('Server listening on port: ' + port);
})