const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017//";
const client = new MongoClient(url);

// Database Name
const dbName = "myProject";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("documents");

  //######### INSERT ########

  const insertResult = await collection.insertMany([
    { a: 1 },
    { a: 2 },
    { a: 3 },
    { a: 4 },
    { a: 5 },

  ]);
  console.log("Inserted documents =>", insertResult);

  //######### FIND ########
  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);

  //######## QUERY FILTER ########

  const filteredDocs = await collection.find({ a: 3 }).toArray();
  console.log("Found documents filtered by { a: 3 } =>", filteredDocs);

  //############ UPDATE #############
  const updateResult = await collection.updateOne({ a: 3 }, { $set: { b: 1 } });
  console.log("Updated documents =>", updateResult);

  // ########### DELETE ##########
  const deleteResult = await collection.deleteMany({ a: 5 },{ a: 4});
  console.log("Deleted documents =>", deleteResult);

  // ######### INDEX ########
  const indexName = await collection.createIndex({ a: 1 });
  console.log("index name =", indexName);

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
