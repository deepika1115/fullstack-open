import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async() => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if(loggedUser){
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      setUser(user)
    }
  },[])

  const showMessage = (type,text) => {
    setMessage({ type, text })
    setTimeout(() => {
      setMessage(null)
    },5000)

  }

  const loginUser = async(userData) => {
    try {
      const user = await loginService.login(userData)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    }catch(error){
      showMessage('error', error.response.data.error)
    }
  }

  const logoutUser = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async(blogData) => {
    try{
      const addedBlog = await blogService.create(blogData)
      addedBlog.user = { name: user.name, username: user.username, id: addedBlog.user }
      setBlogs(prev => [...prev, addedBlog])
      showMessage('notification', `a new blog ${addedBlog.title} by ${addedBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    }catch(error){
      showMessage('error', error.response.data.error)
    }
  }

  const updateBlog = async(blogData) => {
    try{
      const updatedBlog = await blogService.update(blogData)
      const updatedBlogs = blogs.map((b) => {
        if(b.id === updatedBlog.id){
          return { ...b, likes: updatedBlog.likes }
        }
        return b
      })
      setBlogs(updatedBlogs)

    }catch(err){
      showMessage('error', err.response.data.error)
    }
  }

  const removeBlog = async(blog) => {
    try{
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }catch(err) {
      showMessage('error', err.response.data.error)
    }
  }

  if(user === null){
    return (
      <div>
        <Notification message={message}/>
        <LoginForm loginUser={loginUser} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>

      <p>{user.name} logged in <button onClick={logoutUser}>logout</button></p>

      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm  createBlog={createBlog}/>
      </Togglable>

      {[...blogs].sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} currentUser={user} removeBlog={removeBlog}/>
      )}
    </div>
  )
}

export default App