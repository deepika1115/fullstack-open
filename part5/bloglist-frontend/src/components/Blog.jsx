import { useState } from 'react'

const Blog = ({ blog, updateBlog, currentUser, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikeClick = () => {
    blog.likes += 1
    updateBlog(blog)
  }

  const handleRemoveClick = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      removeBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
        {visible && <div>
          {blog.url} <br />
          likes {blog.likes} <button onClick={handleLikeClick}>like</button> <br />
          {blog.user.name} <br />
          {(currentUser.username === blog.user.username) && <button style={{ backgroundColor: 'Highlight' }} onClick={handleRemoveClick}>remove</button>}
        </div>
        }
      </div>
    </div>
  )
}

export default Blog