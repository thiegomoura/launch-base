const express = require('express')
const nunjucks = require('nunjucks')
const server = express()
const videos = require("./data")

server.use(express.static("public"))
server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
    autoescape: false
})

server.get("/", function(request, response){
    const about = {
        avatar_url: "https://avatars3.githubusercontent.com/u/18420762?s=400&u=5fa3d3209f953669f08287c2cd5d5c6f0e597a61&v=4",
        name: "Thiego Moura",
        role: 'Assitente de Tecnologia no <a href="http://www.barralcool.com.br" target="_blank">Grupo Barracool</a>',
        description: '"Practice makes perfect" Technology Assistance Technician in Systems Development Student of Computer Science',
        links: [
            {name: "Github", url: "https://github.com/thiegomoura"},
            {name: "Twwiter", url: ""},
            {name: "Linkedin", url: "https://www.linkedin.com/in/thiegomoura/"},
        ]
    }
    return response.render("about", { about })
})
server.get("/portfolio", function(request, response){
    return response.render("portfolio", {items: videos})
})

const port = 5000

server.listen(port, function(){
    console.log(`Server is running at port ${port} ✔`)
})