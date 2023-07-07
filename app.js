const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
const date = require(__dirname + '/date.js');

const dbUsername = process.env.MONGO_DB_USERNAME || "root";
const dbPassword = process.env.MONGO_DB_PASSWORD || "root";
const dbIp = process.env.MONGO_DB_IP || "127.0.0.1";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://' + dbUsername + ':' + dbPassword + '@' + dbIp + ':27017');
}

const itemSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  }
});

const listItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  items: [itemSchema]
});

const Item = mongoose.model("Item", itemSchema);
const ListItem = mongoose.model("ListItem", listItemSchema);

app.get('/', (req, res) => {
  const day = date.getDay();
  Item.find({}).then((items) => {
    res.render('list', { listTitle: day, items: items });
  })
});

app.post('/', (req, res) => {
  const item = req.body.item;
  const listTitle = req.body.list;

  const newItem = new Item({
    content: item
  });

  ListItem.findOne({ title: listTitle }).then((list) => {
    if (list) {
      list.items.push(newItem);
      list.save();
      res.redirect('/' + listTitle);
    } else {
      newItem.save();
      res.redirect('/');
    }
  });
});

app.get('/about', (req, res) => {
  res.render('about');
})

app.post('/delete', (req, res) => {
  const itemId = req.body.checkbox;
  const listTitle = req.body.listTitle[0];

  ListItem.findOne({ title: listTitle }).then((list) => {
    console.log(list);
    if (list) {
      list.items.pull({_id: itemId});
      list.save();

      res.redirect('/' + listTitle);
    } else {
      Item.findByIdAndRemove(itemId).then((data) => {
        console.log('Deleted item : ' + data);
      });

      res.redirect('/');
    }
  });
})

app.get('/:customListName', (req, res) => {
  const listName = _.capitalize(req.params.customListName);

  ListItem.findOne({ title: listName }).then((list) => {
    if (!list) {
      const newList = new ListItem({
        title: listName,
        items: []
      });
      newList.save();

      res.redirect('/' + listName);
    } else {
      res.render('list', { listTitle: list.title, items: list.items });
    }
  });
});





app.listen(port, function () {
  console.log('Server listening on port: ' + port);
})