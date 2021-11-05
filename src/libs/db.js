// mongodb+srv://vk:vk@cluster0.wiq8f.mongodb.net/vkDb?retryWrites=true&w=majority

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://vk:vk@cluster0.wiq8f.mongodb.net/vkDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});