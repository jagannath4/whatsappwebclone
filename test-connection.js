const dotenv = require('dotenv');
dotenv.config();

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

try {
  const { MongoClient } = require('mongodb');
  console.log('✅ MongoDB module loaded successfully');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  client.connect()
    .then(() => {
      console.log('✅ Connected to MongoDB successfully');
      return client.db('whatsapp').listCollections().toArray();
    })
    .then(collections => {
      console.log('Collections in whatsapp database:', collections.map(c => c.name));
      return client.close();
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
    });
    
} catch (error) {
  console.error('❌ Error loading MongoDB module:', error.message);
} 