
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.static('../public'))


app.get('/notes', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/notes.html'))
    console.log('GET request successful - notes.html sent to user')
})



app.listen(5000, () => {
    console.log('Server is listening to port 5000...')
})

