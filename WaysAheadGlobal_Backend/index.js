const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('images'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


app.use('/api/auth', require('./routes/auth'));
app.use('/api/job', require('./routes/job'));
connectDB();

app.get('/', (req, res) => {
    res.send('hello user');
});

app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, company, interest, country, sector, description } = req.body;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'saransuman1757@gmail.com',
                pass: 'udvh orua oyza vjao'
            }
        });
        const mailOptions = {
            from: `${req.body.email}`,
            to: "saransuman1757@gmail.com",
            subject: 'Submission received from WaysAheadGlobal website',
            html: `
            <table border="1">
                <tr>
                    <th>Name</th>
                    <td>${name}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>${email}</td>
                </tr>
                <tr>
                    <th>Company</th>
                    <td>${company}</td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>${description}</td>
                </tr>
                <tr>
                    <th>Interest</th>
                    <td>${interest}</td>
                </tr>
                <tr>
                    <th>Country</th>
                    <td>${country}</td>
                </tr>
                <tr>
                    <th>Sector</th>
                    <td>${sector}</td>
                </tr>
            </table>
        `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        res.status(200).json({ message: 'Submission successful', messageId: info.messageId, success: true });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
