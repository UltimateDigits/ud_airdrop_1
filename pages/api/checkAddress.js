// pages/api/checkAddress.js
import fs from 'fs';

const handler = (req, res) => {
    if (req.method === 'POST') {
        const address = req.body.address.trim(); // Take the address as is from the body and trim any whitespace
        const filePath = 'public/data/output-onlinetools.txt'; // Update the path to your text file
        let found = false;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error reading text file' });
                return;
            }
            // Split the data by commas to get individual addresses
            const addresses = data.split(',\n').map(addr => addr.trim()); 
            found = addresses.includes(address);

            res.status(200).json({ found });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
