exports.post = function (request, response) {
    const keys = Object.keys(request.body)
    for (key of keys) {
        if (request.body[key] == "")
        return response.send('Please, fill all fields!')
    }
    return response.send(keys)
}