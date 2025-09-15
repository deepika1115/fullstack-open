const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const helper = require('./user_test_helper')

const api = supertest(app)

describe('when there is initially some users saved', () => {
    beforeEach(async() => {
        const response = await User.deleteMany({})
        const res = await User.insertMany(helper.initialUsers)
    })

    test('users are retured as json', async() => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('all users are returned', async() => {
        const response = await api.get('/api/users')
        assert.strictEqual(response.body.length, helper.initialUsers.length)
    })

    describe('addition of a new user', () => {
        test('a valid user can be added', async() => {
            const newUser = {
                name: "Robert C. Martin",
                username: "Robert",
                password: "Robert"
            }
            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersInDb = await helper.usersInDb()
            const usernames = usersInDb.map(u => u.username)
            
            assert.strictEqual(usersInDb.length, helper.initialUsers.length + 1)
            assert(usernames.includes('Robert'))

        })

        test('a user without username or password can not be added and respond with status 400', async() => {
            const user1 = {
                name: "Robert C. Martin",
                password: "Robert"
            }

            const user2 = {
                username: "David",
                name: "David C. Martin",
            }

            await api
                .post('/api/users')
                .send(user1)
                .expect(400)

            await api
                .post('/api/users')
                .send(user2)
                .expect(400)
            
            const usersInDb = await helper.usersInDb()
            assert.strictEqual(usersInDb.length, helper.initialUsers.length)
        })

        test('a user with existing username can not be added and respond with status 400', async() => {

            const usersAtStart = await helper.usersInDb()
            const existingUsername = usersAtStart[0].username
            const newUser = {
                name: "Robert C. Martin",
                username: existingUsername,
                password: "Robert"
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersInDb = await helper.usersInDb()
            assert.strictEqual(usersInDb.length, helper.initialUsers.length)
        })

    })

})

after(async() => await mongoose.connection.close())



