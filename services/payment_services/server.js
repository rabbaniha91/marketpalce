const express = require('express')


const app = express()

app.use(authenticate)



app.listen(3000, () => {
    console.log(`server run on port 3000`)
})