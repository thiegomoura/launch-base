const fs = require('fs')
const data = require("../data.json")
const { age, date } = require('../utils')

exports.index = function (request, response) {
    return response.render('instructors/index', { instructors: data.instructors })
}

exports.show = function (request, response) {
    const { id } = request.params

    const foundInstructor = data.instructors.find(function (instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) return response.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return response.render("instructors/show", { instructor })
}

exports.create = function (request, response) {
    return response.render('instructors/create')
}

exports.post = function (request, response) {
    const keys = Object.keys(request.body)
    for (key of keys) {
        if (request.body[key] == "")
            return response.send('Please, fill all fields!')
    }

    let { name, avatar_url, birth, gender, services } = request.body
    birth = Date.parse(birth)
    const id = Number(data.instructors.length + 1)
    const created_at = Date.now()

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
    })

    // data.instructors.push(request.body)
    fs.writeFile("data.json", JSON.stringify(data, null, 4), function (err) {
        if (err) return response.send("Write file error!")

        return response.redirect("/instructors")
    })
}

exports.edit = function (request, response) {
    const { id } = request.params

    const foundInstructor = data.instructors.find(function (instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) return response.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso,
    }

    return response.render('instructors/edit', { instructor })
}

exports.put = function (request, response) {
    const { id } = request.body

    let index = 0;
    const foundInstructor = data.instructors.find(function (instructor, foundIndex) {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) return response.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        ...request.body,
        birth: Date.parse(request.body.birth)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return response.send("Write error!")
        return response.redirect(`/instructors/${id}`)
    })
}

exports.delete = function (request, response) {
    const { id } = request.body

    const filteredInstructors = data.instructors.filter(function (instructor) {
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return response.send("Write error!")
        return response.redirect("/instructors")
    })
}