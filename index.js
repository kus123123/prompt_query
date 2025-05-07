import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import { queryDatabase } from './dbconnect.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Ensure dotenv is configured here too if needed, or manage centrally.

const app = express();
const port = 3002;

// Serve static files from the 'public' directory under the '/promptsquery' path
app.use('/promptsquery', express.static('public'));

app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});



app.post('/promptsquery/generate-sql', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }

    try {
        const context = `There are three tables in our PostgreSQL database:
        1.  **customers** (customer_id SERIAL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(100) UNIQUE, city VARCHAR(50), country VARCHAR(50))
        2.  **orders** (order_id SERIAL PRIMARY KEY, customer_id INTEGER REFERENCES customers(customer_id), order_date DATE NOT NULL, product_id INTEGER REFERENCES products(product_id), quantity INTEGER NOT NULL)
        3.  **products** (product_id SERIAL PRIMARY KEY, product_name VARCHAR(100) NOT NULL, category VARCHAR(50), price DECIMAL(10, 2))`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `You are an assistant that converts natural language prompts into single-line PostgreSQL queries. Use the following database schema: ${context}`,
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.2
        });

        const sqlQuery = completion.choices[0].message.content.trim();

        // Execute the generated SQL using the queryDatabase function
        const data = await queryDatabase(sqlQuery);
        console.log(sqlQuery);
        
        res.json({ results: data });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate and execute SQL' });
    }
});

app.get('/promptsquery/test', (req, res) => {
    return res.status(200).send("hello world");
});

app.listen(port, () => {
    console.log(`🔥 Server listening on http://localhost:${port}`);
});