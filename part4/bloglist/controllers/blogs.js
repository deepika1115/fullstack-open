const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async(request, response) => {
  const user = request.user
  if(!request.body.likes){
    request.body.likes = 0
  }
  request.body.user = user.id

  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', userExtractor, async(request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).json({error: 'blog not found'})
  }

  if(blog.user?.toString() === user.id){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }else{
    response.status(403).json({error: 'unauthorized user'})
  } 
})

blogRouter.put('/:id', userExtractor, async(request, response) => {
  const user = request.user
  const {title, author, url, likes} =  request.body

  const blogToUpdate = await Blog.findById(request.params.id)

  if(blogToUpdate.user.toString() !==  user.id){
    return response.status(403).json({error: 'unauthorized user'})
  }

  blogToUpdate.title = title
  blogToUpdate.author = author
  blogToUpdate.url = url
  blogToUpdate.likes = likes
  blogToUpdate.user = user.id

  const result = await blogToUpdate.save()
  response.json(result)
})

module.exports = blogRouter