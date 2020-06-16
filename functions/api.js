const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

const admin = require('firebase-admin');
admin.initializeApp();

const api = express();
api.use(cors({ origin: true }));
api.use(bodyParser.json({ type: 'application/json' }));

// GET api/v1/employees
api.get('/v1/employees', async (req, res) => {
  const snapshot = await admin.firestore().collection('employees').get();
  let employees = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    employees.push({
      id: doc.id,
      employee_name: data.name,
      employee_salary: data.salary,
      employee_age: data.age,
      profile_image: data.profile_image
    });
  });
  return res.json({
    status: "success",
    data: employees
  });
});

// GET api/v1/employee/:id
api.get('/v1/employee/:id', async (req, res) => {
  const doc = await admin.firestore().collection('employees').doc(req.params.id).get();
  if (!doc.exists)
    return res.status(404)
      .json({
        "status": "failed",
        "data": "Record does not found."
      });
  const data = doc.data();
  return res.json({
    status: "success",
    data: {
      id: doc.id,
      employee_name: data.name,
      employee_salary: data.salary,
      employee_age: data.age,
      profile_image: data.profile_image
    }
  });
});

// POST api/v1/create
api.post('/v1/create', async (req, res) => {
  const { name = null, salary = null, age = null, profile_image = null } = req.body;
  const result = await admin.firestore().collection('employees').add({ name, salary, age, profile_image });
  return res.json({
    status: "success",
    data: {
      id: result.id,
      name,
      salary,
      age,
      profile_image
    }
  });
});

// PUT api/v1/update/:id
api.put('/v1/update/:id', async (req, res) => {
  const id = req.params.id;
  const doc = await admin.firestore().collection('employees').doc(id).get();
  if (!doc.exists)
    return res.status(404)
      .json({
        "status": "failed",
        "data": "Record does not found."
      });
  const { name = null, salary = null, age = null, profile_image = null } = req.body;
  const result = await admin.firestore().collection('employees').doc(id).set({ name, salary, age, profile_image });
  return res.json({
    status: "success",
    data: {
      id: result.id,
      name,
      salary,
      age,
      profile_image
    }
  });
});

// DELETE api/v1/delete/:id
api.delete('/v1/delete/:id', async (req, res) => {
  const id = req.params.id;
  const doc = await admin.firestore().collection('employees').doc(id).get();
  if (!doc.exists)
    return res.status(404)
      .json({
        "status": "failed",
        "data": "Record does not found."
      });
  await admin.firestore().collection('employees').doc(id).delete();
  return res.json({
    status: "success",
    message: "successfully! deleted Records"
  });
});

module.exports = api;
