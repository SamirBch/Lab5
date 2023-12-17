// Import express
const express = require('express');

// Initialize the app
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Database connection
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'users'
});
connection.connect((error) => { if (error) console.log(error); });

// Send message for default URL
app.get('/', (req, res) => {
    res.send('Hello');
});

// Send list of users
app.get('/user', (req, res) => {
    connection.query("SELECT * FROM user;", (error, result) => {
        if (error) console.error(error);
        res.render('userList.ejs', { users: result });
    });
});

// Send form to add user
app.get('/user/add', (req, res) => {
    res.render("userAdd.ejs");
});

// Save user in db
app.post('/user', (req, res) => {
    const user = { "lastname": req.body.lastname, "firstname": req.body.firstname };
    connection.query("INSERT INTO user SET ?", user, (err, result) => {
        if (err) console.error(err);
        res.redirect('/user');
    });
});

// Send update form
app.get('/user/update/:i', (req, res) => {
    const i = req.params.i;
    connection.query("SELECT * FROM user WHERE iduser = ?;", [i], (error, result) => {
        if (error) console.error(error);
        res.render("userUpdate.ejs", { "iduser": result[0].iduser, "lastname": result[0].lastname, "firstname": result[0].firstname });
    });
});

// Update user in db
app.post('/user/update', (req, res) => {
    const i = req.body.iduser;
    const user = { "lastname": req.body.lastname, "firstname": req.body.firstname };
    connection.query("UPDATE user SET ? WHERE iduser = ?", [user, i], (err, result) => {
        if (err) console.error(err);
        res.redirect('/user');
    });
});

// Delete user
app.get('/user/delete/:i', (req, res) => {
    const i = req.params.i;
    connection.query("DELETE FROM user WHERE iduser = ?;", [i], (error, result) => {
        if (error) console.error(error);
        res.redirect('/user');
    });
});

// Launch app to listen to specified port
app.listen(8000, () => {
    console.log('Running on port 8000');
});
