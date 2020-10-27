const { age, date } = require('../../lib/utils')
const Member = require('../models/member')
module.exports = {
    index(request, response) {
        Member.all(function (members) {
            return response.render("members/index", { members })
        })
    },
    create(request, response) {
        return response.render('members/create')
    },
    post(request, response) {
        const keys = Object.keys(request.body)
        for (key of keys) {
            if (request.body[key] == "")
                return response.send('Please, fill all fields!')
        }

        Member.create(request.body, function (member) {
            return response.redirect(`/members/${member.id}`)
        })
    },
    show(request, response) {
        Member.find(request.params.id, function (member) {
            if (!member) return response.send("Member not found!")

            member.birth = date(member.birth).birthDay

            return response.render("members/show", { member })
        })
    },
    edit(request, response) {
        Member.find(request.params.id, function (member) {
            if (!member) return response.send("Member not found!")

            member.birth = date(member.birth).iso

            return response.render("members/edit", { member })
        })
    },
    put(request, response) {
        const keys = Object.keys(request.body)
        for (key of keys) {
            if (request.body[key] == "")
                return response.send('Please, fill all fields!')
        }
        Member.update(request.body, function(){
            return response.redirect(`/members/${request.body.id}`)
        })
    },
    delete(request, response) {
        Member.delete(request.body.id, function(){
            return response.redirect("/members")
        })
    },
}