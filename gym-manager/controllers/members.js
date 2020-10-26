const fs = require('fs')
const data = require("../data.json")
const { date } = require('../utils')

exports.index = function (request, response) {
    return response.render('members/index', { members: date.members })
}

exports.create = function (request, response) {
    return response.render('members/create')
}

exports.post = function (request, response) {
    const keys = Object.keys(request.body)
    for (key of keys) {
        if (request.body[key] == "")
            return response.send('Please, fill all fields!')
    }

    birth = Date.parse(request.body.birth)

    let id = 1
    const lastMember = data.members[data.members.length - 1]
    if (lastMember)
        id = lastMember.id + 1

    data.members.push({
        id,
        ...request.body,
        birth
    })

    // data.members.push(request.body)
    fs.writeFile("data.json", JSON.stringify(data, null, 4), function (err) {
        if (err) return response.send("Write file error!")

        return response.redirect(`/members`)
    })
}

exports.show = function (request, response) {
    const { id } = request.params

    const foundMember = data.members.find(function (member) {
        return member.id == id
    })

    if (!foundMember) return response.send("Member not found!")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay
        // created_at: new Intl.DateTimeFormat("pt-BR").format(foundMember.created_at),
    }

    return response.render("members/show", { member })
}


exports.edit = function (request, response) {
    const { id } = request.params

    const foundMember = data.members.find(function (member) {
        return member.id == id
    })

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso,
        id: Number(request.body.id)
    }

    if (!foundMember) return response.send("Member not found!")
    return response.render('members/edit', { member })
}

exports.put = function (request, response) {
    const { id } = request.body

    let index = 0;
    const foundMember = data.members.find(function (member, foundIndex) {
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) return response.send("Member not found!")

    const member = {
        ...foundMember,
        ...request.body,
        birth: Date.parse(request.body.birth)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return response.send("Write error!")
        return response.redirect(`/members/${id}`)
    })
}

exports.delete = function (request, response) {
    const { id } = request.body

    const filteredMembers = data.members.filter(function (member) {
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return response.send("Write error!")
        return response.redirect("/members")
    })
}