const User = require('../models/user')

const initialUsers = [
    {
        username: "Michael",
        name: "Michael Chan",
        passwordHash: "Michael"
    },
    {
        username: "Edsger",
        name: "Edsger W. Dijkstra",
        passwordHash: "Edsger"
    }
]

const usersInDb = async() => {
    const result = await User.find({})
    return result.map(user => user.toJSON())
}

module.exports = {initialUsers, usersInDb}