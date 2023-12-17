const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',         //le mot de passe pour me connecter sur mysql
    database: 'users' // Assurez-vous que le nom de la base de données est correct
});

connection.connect((error) => {
    if (error) console.log(error);
});

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route pour afficher la liste des tâches en utilisant le fichier EJS
app.get('/', (req, res) => {
    connection.query("SELECT * FROM task_list;", (error, result) => {
        if (error) console.error(error);
        //console.log(JSON.stringify(result))
        res.render('exo', { tasks: result, message: '' });
    });
});

// Route pour ajouter une tâche
app.post('/addTask', (req, res) => {
    const newTask = req.body.newTask;

    if (newTask) {
        connection.query("INSERT INTO task_list (task) VALUES (?)", [newTask], (err, result) => {
            if (err) console.error(err);
            res.redirect('/');
        });
    } else {
        res.render('exo', { tasks: [], message: 'Complétez la tâche' });
    }
});

// Route pour effacer une tâche
app.get('/deleteTask/:id', (req, res) => {
  const taskId = req.params.id;

  if (taskId) {
      connection.query("DELETE FROM task_list WHERE idtask_list = ?", [taskId], (err, result) => {
          if (err) console.error(err);
          res.redirect('/');
      });
  } else {
      res.render('exo', { tasks: [], message: 'ID de tâche non valide' });
  }
});



// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur is running on port ${port}`);
});






//      connection.query("SELECT * FROM task_list;", (error, result) => {
  //      if (error) console.error(error);
  //        res.render('exo', { tasks: result, message: '' });         il peut y avoir des problèmes, il faut etre sur que cette ligne ce finissie avant de continuer le reste (awync, await,..)
//         });
//});