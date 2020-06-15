const { MongoClient, ObjectId } = require("mongodb");
MongoClient.connect("mongodb://localhost:27017/employees")
  .then(conn => global.conn = conn.db("employees"))
  .catch(err => console.log(err))

function findAll(callback) {
  global.conn.collection("employees").find({}).toArray(callback);
}

function insert(employee, callback) {
  global.conn.collection("employees").insert(employee, callback);

}

function findOne(id, callback) {
  global.conn.collection("employees").find(new ObjectId(id)).toArray(callback);
}

function update(id, customer, callback) {
  global.conn.collection("employees").updateOne({ _id: new ObjectId(id) }, { $set: customer }, callback);
}

function deleteOne(id, callback) {
  global.conn.collection("employees").deleteOne({ _id: new ObjectId(id) }, callback);
}

module.exports = { findAll, insert, findOne, update, deleteOne }