
// modules
const {readFile, writeFile} = require('fs')
const path = require('path')

// port needs to be a variable using OR operator so that port works on Heroku as well as local device
const port = process.env.PORT || 5000

// express
const express = require('express')
const app = express()



// middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('./Develop/public'))



// GET and POST requests

// home page, send index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'))
})

// notes page, send notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
})

// for api page, GET and POST request using routes
app.route('/api/notes')
.get((req, res) => {

    // read db.json file
    readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        // if data is truthy, parse the json data so that it's a javascript object, then you can pass it in as an argument into res.json, this sends it as the response in json
        // if data is not truthy, log the error to the console
        data ? res.json(JSON.parse(data)) : console.log(err)
    })

}).post((req, res) => {

    // the information we need about the note the user saved will be located in req.body, destructure title and text out of req.body
    const {title, text} = req.body
    // create object with only these two properties
    const currentNote = {
        title,
        text
    }

    // read db.json file
    readFile('./Develop/db/db.json', 'utf8', (err, dataJSON) => {

        // guard clause just in case there is an error
        // immediately return this callback function and log the error to the console
        if(err) return console.log(err)

        // parse dataJSON to create a javascript array, save that array to a variable
        const parsedJSONArray = JSON.parse(dataJSON)
        // push the currentNote from POST request into this array
        parsedJSONArray.push(currentNote)

        // now we have a new array, parsedJSONArray, that includes the current note that was sent by POST request
        // we can now rewrite db.json to include this note
        // if db.json already exists in the path specified in the first argument, then it will simply alter that file instead
        // for the second argument, we convert parsedJSONarray into json, that will be the content of db.json when writeFile is finished
        // third argument is a callback function that will be executed when writeFile is finished, if there is an error, log that error to the console
        writeFile('./Develop/db/db.json', JSON.stringify(parsedJSONArray), err => {if(err) console.error(err)})

        // to end POST request, return parsedJSONArray as json in the response
        res.json(parsedJSONArray)

    })

})



// listening on port
app.listen(port, () => {
    console.log('Server is listening for requests...')
})