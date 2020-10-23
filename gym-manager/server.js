const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const server = express()

server.use(express.urlencoded({extended: true}))
server.use(express.static("public"))
server.use(routes)
server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

const port = 5000

server.listen(port, function () {
    console.log(`Server is running at port ${port} ✔`)
})