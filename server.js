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
  check to see if the username and password send match. 
  if they match send a json with a status of "logged in" or 
  respond with a json that has a status of "invalid credentials" */
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


app.get('/users', (req, res) => {
    res.status(200).json(users)
})

app.post('/users/add', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    users.forEach(user => {
        if(user.username === username){
            return res.status(406).json({error:`${username} already exists`})
        } 
    })
    id_count++;
    users.push({id: id_count, username, password})
    res.status(200).redirect('/users')
})

app.delete('users/delete/:id', (req, res) => {
    let id = req.params.id
    let test = users.indexOf(users[id])
    
    if(test !== -1){
        users.splice(id,1)
    } else {
        return res.status(406).json({error: `No user id of ${id}`})
    }
    res.status(200).redirect('/users')
})

// PART 2: TODOs
let todo_id_count = 4;
let todos = [
    {
        id: 0,
        title: "Walk dog",
        author: "Chris Milkaitis",
        content: "Must walk the dog before 5:00 PM"
    },
    {
        id: 1,
        title: "Buy Milk",
        author: "Joe Smith",
        content: "Get to the store and buy milk"
    },
    {
        id: 2,
        title: "Read Book",
        author: "Chris Milkaitis",
        content: "Finish last chapter of the book"
    },
    {
        id: 3,
        title: "Walk dog",
        author: "Mary Jones",
        content: "Remember to walk dog"
    }
]

// Display all TODOS
app.get('/todos', (req, res) => {
    res.status(200).send(todos)
})

// Return 1 matching TODO based on param
app.get('/todos/:match', (req,res) => {
    let match = req.params.match
    let isMatch = false
    let obj_match
    todos.forEach(item => {
        for(const prop in item) {
            if(match == item[prop]){
                obj_match = item
                isMatch = true
            }   
        }
    })

    if(isMatch){
        res.status(200).send(obj_match)
    } else {
        res.status(400).json({error: "No match in TODOs"})
    } 
})

// Return all TODOs that match user param
app.get('/todos/search/:match', (req, res) => {
    let match = req.params.match
    let isMatch = false
    let obj_match = []

    todos.forEach(item => {
        for(const prop in item) {
            if(match == item[prop]){
                obj_match.push(item)
                isMatch = true
            }   
        }
    })

    if(isMatch){
        res.send(obj_match)
    } else {
        res.status(400).json({error: "No matchs in TODOs"})
    } 
})

// Add a TODO
app.post('/todos/add', (req, res) => {
    let title = req.body.title 
    let author = req.body.author
    let content = req.body.content

    if(!title || !author || !content) {
        return res.status(400).json({error: "Please enter in all required fields"})
    }
    todos.push({id: todo_id_count, title, author, content})
    todo_id_count++
    res.status(200).redirect('/todos')
})

// Delete a TODO based on ID
app.delete('/todos/delete/:id', (req,res) => {
    let id = req.params.id
    let test = todos.indexOf(todos[id])
   
    if(test !== -1){
        todos.splice(id,1)
    } else {
        return res.status(406).json({error: `No user todo with id:${id}`})
    }
    res.status(200).redirect('/todos')
})

// Update a todo based on ID
app.put('/todos/update/:id', (req, res) => {
    let id = req.params.id
    let test = todos.indexOf(todos[id])
    let title = req.body.title 
    let author = req.body.author
    let content = req.body.content

    if(!title && !author && !content) {
        return res.status(400).json({error: "Please enter in at least 1 of the fields"})
    }

    if(test !== -1){
        if(title){
            todos[id].title = title
        }
        if(author){
            todos[id].author = author
        }
        if(content){
            todos[id].content = content 
        }
    } else {
        return res.status(406).json({error: `No user todo with id:${id}`})
    }
    res.status(200).redirect('/todos')
})

// delete route that accepts the author, route should delete all tasks made by that author
app.delete('/todos/delete/author/:author', (req,res) => {
    let author = req.params.author
    let isMatch = false

    if(!author){
        return res.status(406).json({error: "Please enter an author parameter"})
    }

    todos.forEach(item => {
        for(const prop in item) {
            if(author == item[prop]){
                todos.splice(todos.indexOf(item),1)
                isMatch = true
            }   
        }
    })

    if(isMatch){
        res.status(200).redirect('/todos')
    } else {
        res.status(400).json({error: "No match in TODOs"})
    } 

})

app.listen(port, console.log(`Listening on ${port}`))