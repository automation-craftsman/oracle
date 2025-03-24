const express = require('express');
const quotesy = require('quotesy');
const os = require('os');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Allow CORS from all origins

app.use(express.json());

app.get('/quote', (req, res) => {
  try {
    const quote = quotesy.random();
    const hostname = os.hostname();

    res.json({
      quote: quote.text,
      author: quote.author || 'Unknown',
      hostname,
    });
  } catch (error) {
    console.error('Error generating quote:', error.message);
    res.json({
      quote: 'Be the change you wish to see in the world.',
      author: 'Mahatma Gandhi',
      hostname: os.hostname(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
