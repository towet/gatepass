const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'gatepass';
const COLLECTION = 'passes';

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    cachedDb = db;
    return db;
}

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const db = await connectToDatabase();
        const collection = db.collection(COLLECTION);

        if (event.httpMethod === 'GET') {
            const passes = await collection.find({}).toArray();
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(passes)
            };
        }

        if (event.httpMethod === 'POST') {
            const pass = JSON.parse(event.body);
            const result = await collection.insertOne({
                ...pass,
                timestamp: new Date().toLocaleString()
            });
            return {
                statusCode: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    ...pass,
                    _id: result.insertedId
                })
            };
        }

        return {
            statusCode: 405,
            body: 'Method not allowed'
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to perform operation' })
        };
    }
};
