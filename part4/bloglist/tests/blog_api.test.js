const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./blog_test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    let token = null
    beforeEach(async() => {
        await Blog.deleteMany({})

        const user = await api
            .post('/api/users')
            .send({username : 'test', name: 'Test User', password: 'password'})

        const testUser = await User.findOne({ username: 'test' })

        const blogswithUsers = helper.initialBlogs.map(b => ({ ...b, user: testUser.id }))
        
        await Blog.insertMany(blogswithUsers)
    })

    test('blogs are retured as json', async() => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async() => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique identifier property of the blog posts is named id', async() => {
        const response = await api.get('/api/blogs')
        const hasId = response.body.every(data => Object.hasOwn(data, 'id'))
        assert(hasId)
    })


    describe('when a user is logged in', () => {
        let token = null

        beforeEach(async() => {
            const loginResponse = await api
            .post('/api/login')
            .send({ 
                username: 'test',
                password: 'password' 
            })

            token = loginResponse.body.token
        })
        
        describe('addition of a valid new blog', () => {
            
            test('a valid blog can be added', async() => {
                const newBlog = {
                    title: "First class tests",
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                    likes: 10
                }
                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                const blogsInDb = await helper.blogsInDb()
                const titles = blogsInDb.map(b => b.title)
                
                assert.strictEqual(blogsInDb.length, helper.initialBlogs.length + 1)
                assert(titles.includes('First class tests'))
            })

            test('a blog without likes propery will be added with default value as zero', async() => {
                const newBlog = {
                    title: "First class tests",
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
                }

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                const blogsInDb = await helper.blogsInDb()
                const addedBlog = blogsInDb.find(b => b.title === 'First class tests')
                assert.strictEqual(addedBlog.likes, 0)
            })

            test('a blog without title or url can not be added and respond with status 400', async() => {
                const blog1 = {
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                    likes: 10
                }

                const blog2 = {
                    title: "TDD harms architecture",
                    author: "Robert C. Martin",
                    likes: 0,
                }

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(blog1)
                    .expect(400)

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(blog2)
                    .expect(400)
                
                const blogsInDb = await helper.blogsInDb()
                assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
            })

            test('a blog without token can not be added and respond with a status 401 Unauthorized', async() => {
                const newBlog = {
                    title: "First class tests",
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                    likes: 10
                }
                await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .expect(401)

                const blogsInDb = await helper.blogsInDb()
                assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
            })
        })
    

        describe('deletion of a blog', () => {

            test('succeeds with status code 204 if id is valid and user is authorized', async() => {
                const blogsAtStart = await helper.blogsInDb()
                const blogToDelete = blogsAtStart[0]

                await api
                    .delete(`/api/blogs/${blogToDelete.id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(204)

                const blogsAtEnd = await helper.blogsInDb()

                const titles = blogsAtEnd.map(b => b.title)
                assert(!titles.includes(blogToDelete.title))

                assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
            })
        })

        describe('updation of a blog', () => {

            test('a valid blog can be updated', async() => {
                const blogsAtStart = await helper.blogsInDb()
                const blogToUpdate = blogsAtStart[0]
                const id = blogToUpdate.id
                blogToUpdate.likes = 100  
                delete blogToUpdate.id

                await api
                    .put(`/api/blogs/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(blogToUpdate)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
                
                const blogsAtEnd = await helper.blogsInDb()
                const updatedBlog = blogsAtEnd.find(b => b.id === id)
                assert(updatedBlog.likes, 100)
            })
        })
    })
})

after( async() => await mongoose.connection.close() )