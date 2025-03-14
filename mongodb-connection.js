import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { MongoClient, ServerApiVersion } = require('mongodb');

const username = 'adminuser';
const password = 'T09mZJ2Gn6scJGoX';
const uri = `mongodb://adminuser:T09mZJ2Gn6scJGoX@masterartwork-shard-00-00.lfqby.mongodb.net:27017,masterartwork-shard-00-01.lfqby.mongodb.net:27017,masterartwork-shard-00-02.lfqby.mongodb.net:27017/?ssl=true&replicaSet=atlas-xl5bi9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=masterartwork`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 50,
  minPoolSize: 0
});

async function run() {
  try {
    // Connect the client to the server
    console.log('Attempting to connect to MongoDB...');
    console.log('Using database: masterartwork');
    
    await client.connect();
    
    // Send a ping to confirm a successful connection
    const db = client.db("masterartwork");
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // Test database access
    try {
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
    } catch (error) {
      console.error('Error listing collections:', error);
    }
    
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Connection failed. Please verify:');
      console.error('1. Network connectivity to MongoDB Atlas servers');
      console.error('2. Database credentials are correct');
      console.error('3. Database name and replica set are correct');
    }
    throw error;
  }
}

// Export both the client and the connection function
export { client, run }; 