
const {readFile, writeFile} = require('fs')
const path = require('path')



const port = process.env.PORT || 5000


const express = require('express')
const app = express()



app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('./Develop/public'))



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
})



app.route('/api/notes')
.get((req, res) => {

    readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        data ? res.json(JSON.parse(data)) : console.log(err)
    })

}).post((req, res) => {

    const {title, text} = req.body

    const currentNote = {
        title,
        text
    }

    readFile('./Develop/db/db.json', 'utf8', (err, dataJSON) => {

        // guard clause just in case there is an error
        if(err) console.log(err)

        const parsedJSONArray = JSON.parse(dataJSON)

        parsedJSONArray.push(currentNote)

        writeFile('./Develop/db/db.json', JSON.stringify(parsedJSONArray), err => console.log(err))

        res.json(parsedJSONArray)

    })

})



app.listen(port, () => {
    console.log('Server is listening for requests...')
})