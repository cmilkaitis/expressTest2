const express = require('express')
const app = express()
const bp = require('body-parser')

const port = 5000

app.use(bp.json())
app.use(bp.urlencoded({extended: false}))

let id_count = 3;
let users = [
    {
        id: 0,
        username: "chris123",
        password: "mypassword"
    },
    {
        id: 1,
        username: "chris123",
        password: "mypassword"
    },
    {
        id: 2,
        username: "chris123",
        password: "mypassword"
    },
    {
        id: 3,
        username: "chris123",
        password: "mypassword"
    }
]
app.get('/', (req, res) => {
    res.json(users)
})

app.post('/', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    users.forEach(user => {
        if(user.username === username){
            return res.json({error:`${username} already exists`})
        } 
    })
    id_count++;
    users.push({id: id_count, username, password})
    res.redirect('/')
})

app.delete('/:id', (req, res) => {
    let id = req.params.id
    let test = parseInt(users.indexOf(users[id]))
    
    if(test !== -1){
        users.splice(id,1)
    } else {
        return res.json({error: `No user id of ${id}`})
    }
    res.redirect('/')
})

app.listen(port, console.log(`Listening on ${port}`))