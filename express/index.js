const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json({ type: 'application/json' }));

global.db = require('./db');

// GET api/v1/employees
app.get('/api/v1/employees', async (req, res) => {
  global.db.findAll((err, docs) => {
    if (err) { return console.log(err); }
    let employees = [];
    docs.forEach(function (item) {
      employees.push({
        id: item._id,
        employee_name: item.name,
        employee_salary: item.salary,
        employee_age: item.age,
        profile_image: item.profile_image
      });
    })
    return res.json({
      status: "success",
      data: employees
    });
  });
});

// GET api/v1/employee/:id
app.get('/api/v1/employee/:id', async (req, res) => {
  var id = req.params.id;
  try {
    global.db.findOne(id, (e, docs) => {
      if (e) { return console.log(e.message); }
      if (!docs || !docs.length) {
        return res.status(404)
          .json({
            "status": "failed",
            "data": "Record does not found."
          });
      }
      const doc = docs[0];
      return res.json({
        status: "success",
        data: {
          id: doc._id,
          employee_name: doc.name,
          employee_salary: doc.salary,
          employee_age: doc.age,
          profile_image: doc.profile_image
        }
      });
    });
  }
  catch {
    return res.status(404)
      .json({
        "status": "failed",
        "data": "Record does not found."
      });
  }
});

// POST api/v1/create
app.post('/api/v1/create', async (req, res) => {
  const { name = null, profile_image = null } = req.body;
  const salary = parseFloat(req.body.salary) || null;
  const age = parseInt(req.body.age) || null;
  if (!name)
    return res.status(400).json({
      status: "bad request",
      message: "name is required"
    });
  global.db.insert({ name, salary, age, profile_image }, (err, result) => {
    if (err) { return console.log(err); }
    return res.json({
      status: "success",
      data: {
        id: result.ops[0]._id,
        name,
        salary,
        age,
        profile_image
      }
    });
  });
});

// PUT api/v1/update/:id
app.put('/api/v1/update/:id', async (req, res) => {
  const id = req.params.id;
  try {
    global.db.findOne(id, (e, docs) => {
      if (e) { return console.log(e.message); }
      if (!docs || !docs.length) {
        return res.status(404)
          .json({
            "status": "failed",
            "data": "Record does not found."
          });
      }

      const { name = null, profile_image = null } = req.body;
      const salary = parseFloat(req.body.salary) || null;
      const age = parseInt(req.body.age) || null;
      if (!name) {
        return res.status(400).json({
          status: "bad request",
          message: "name is required"
        });
      }

      global.db.update(id, { name, salary, age, profile_image }, (err, result) => {
        if (err) { return console.log(err); }
        return res.json({
          status: "success",
          data: {
            id,
            name,
            salary,
            age,
            profile_image
          }
        });
      });
    });
  }
  catch {
    return res.status(404)
      .json({
        "status": "failed",
        "data": "Record does not found."
      });
  }
});

// DELETE api/v1/delete/:id
app.delete('/api/v1/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    global.db.findOne(id, (e, docs) => {
      if (e) { return console.log(e.message); }
      if (!docs || !docs.length) {
        return res.status(404)
          .json({
            "status": "failed",
            "data": "Record does not found."
          });
      }
      global.db.deleteOne(id, function (e, result) {
        return res.json({
          status: "success",
          message: "successfully! deleted Records"
        });
      });
    });
  }
  catch {
    return res.status(404)
      .json({
        "status": "failed",
        "data": "Record does not found."
      });
  }
});

// static site
app.use(express.static('./public'));

app.listen(5000, function () {
  console.log('App listening on port 5000!');
});