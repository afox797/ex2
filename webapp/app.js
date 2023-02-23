const express = require('express');

const mysql = require('mysql');

const dbhost = process.env.DBHOST || 'localhost';
const dbPass = process.env.MYSQL_PASSWORD || 'mysql';

function getConnection () {
    return mysql.createConnection({
        host: dbhost,
        port: 3306,
        user: 'mysql',
        password: dbPass,
        database: 'mydb'
    });
}

const app = express();

app.post('/registrations', function (req, res) {
    const { firstName, lastName, grade, email, shirtSize, hrUsername } = req.body;

    // Validate input
    if (!firstName || !lastName || !grade || !email || !shirtSize || !hrUsername) {
        return res.status(400).send('All fields are required.');
    }

    if (!['S', 'M', 'L'].includes(shirtSize)) {
        return res.status(400).send('Invalid shirt size.');
    }

    if (![9, 10, 11, 12].includes(Number(grade))) {
        return res.status(400).send('Invalid grade.');
    }

    const connection = getConnection();

    connection.connect(function (err) {
        if (err) {
            console.log('Problem connecting to database', err);
            res.status(500).send('Unable to connect to database! ' + err);
            return;
        }

        const registration = {
            first_name: firstName,
            last_name: lastName,
            grade,
            email,
            shirt_size: shirtSize,
            hr_username: hrUsername
        };

        const query = 'INSERT INTO registrations SET ?';

        connection.query(query, registration, function (err) {
            if (err) {
                console.log('Problem inserting registration', err);
                res.status(500).send('Unable to insert registration! ' + err);
                return;
            }

            res.status(200).send('Registration successful');
            connection.destroy();
        });
    });
});

let port = process.env.PORT || 8888;
port = parseInt(port);
app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});
