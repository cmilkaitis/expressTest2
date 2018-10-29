const express = require('express')
const app = express()
const bp = require('body-parser')

const port = 5000

app.use(bp.json())
app.use(bp.urlencoded({extended: false}))

// Create a get route that displays your personal name  
app.get("/name/", (req, res) => {
    res.status(200).send("Chris Milkaitis");
  });
  
// Create a dynamic route that says something using the parameter
  app.get("/input/:input", (req, res) => {
    res.status(200).send(req.params.input);
  });
  
// Create a dynamic route a word and should spell the word back one line at a time
app.get("/word/:word", (req, res) => {
    let word = req.params.word;
    let split_word = word.split("");
  
    res.writeHead(200, { "Content-Type": "text/html" });
  
    split_word.forEach(letter => {
      res.write(`${letter}<br>`);
    });
    res.end();
});
  
/* Create a post route that accepts a username and password. 
in your route have a static user name and password and then 
check to see if the username and password send match. if they 
match send a json with a status of "logged in" or respond with 
a json that has a status of "invalid credentials" */
let user = [
    {
      username: "testuser1",
      password: "testpassword"
    }
];
  
app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    if (user[0].username == username && user[0].password == password) {
        res.status(200).send("Logged In");
    } else {
        res.status(422).send("Invaild credentials");
    }
});

let id_count = 3;
let users = [
    {
        id: 0,
        username: "chris123",
        password: "chrispassword"
    },
    {
        id: 1,
        username: "joe24",
        password: "joepassword"
    },
    {
        id: 2,
        username: "skunk45",
        password: "skunkpassword"
    },
    {
        id: 3,
        username: "name1",
        password: "namepassword"
    }
]

app.get('/', (req, res) => {
    res.status(200).json(users)
})

app.post('/', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    users.forEach(user => {
        if(user.username === username){
            return res.status(406).json({error:`${username} already exists`})
        } 
    })
    id_count++;
    users.push({id: id_count, username, password})
    res.status(200).redirect('/')
})

app.delete('/:id', (req, res) => {
    let id = req.params.id
    let test = users.indexOf(users[id])
    
    if(test !== -1){
        users.splice(id,1)
    } else {
        return res.status(406).json({error: `No user id of ${id}`})
    }
    res.status(200).redirect('/')
})

app.get('/home', (req,res) => {
    res.json({msg: "Welcome to the homepage"})
})

app.listen(port, console.log(`Listening on ${port}`))