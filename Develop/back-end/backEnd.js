
// const { json } = require('express')
const express = require('express')
const fs = require('fs')
const path = require('path')
// let notesJSON = require('../db/db.json')


// // read db.json and store it in variable
// let allNotes = fs.readFileSync('../db/db.json', 'utf8')
// // parse this variable to create a javascript array
// let allNotesArray = JSON.parse(allNotes)




const app = express()

app.use(express.static('../public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// app.get('/dbJSON', (req, res) => {
//     res.json(notesJSON)
// })

// app.get('/notes', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, '../public/notes.html'))
//     console.log('GET request successful - notes.html sent to user')
// })

app.get('/api/notes', (req, res) => {
    let JSONfile = fs.readFileSync('../db/db.json', 'utf8')

    n
})

app.post('/api/notes', (req, res) => {
    console.log(req.body)
    // const noteInfoObject = req.body
    
    // allNotesArray.push(noteInfoObject)

    // allNotes = JSON.stringify(allNotesArray)
    // fs.writeFileSync('../db/db.json', allNotes, 'utf8')

    
})


// when app reloads, get db.json, and with the notes already there, display them on the left-hand side


app.listen(5000, () => {
    console.log('Server is listening to port 5000...')
})

