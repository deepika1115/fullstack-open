import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
    const blog = {
        title : 'first blog',
        author: 'some author',
        url: 'https://www.example.com',
        likes: 6,
        user: {
            name: 'test user',
            username: 'testuser'
        }
    }

    const currentUser = {username: 'testuser', name: 'test user'}

    test('renders title and author but not url or likes by default', () => {
        
        render(<Blog blog={blog}/>)

        const title = screen.getByText('first blog', {exact: false})
        const author = screen.getByText('some author', {exact: false})
        const url = screen.queryByText('https://www.example.com')
        const likes = screen.queryByText('6')

        expect(title).toBeInTheDocument()
        expect(author).toBeInTheDocument()
        expect(url).toBeNull()
        expect(likes).toBeNull()
    })

    test('shown url and likes when view button is clicked', async() => {
        render(<Blog blog={blog} currentUser={currentUser}/>)

        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const url = screen.getByText('https://www.example.com', {exact: false})
        const likes = screen.getByText('likes 6', {exact: false})

        expect(url).toBeInTheDocument()
        expect(likes).toBeInTheDocument()
    })

    test('event handler received as props is called twice if like button is clicked twice', async() => {
        const mockHandler = vi.fn()

        render(<Blog blog={blog} updateBlog={mockHandler} currentUser={currentUser} />)

        const user = userEvent.setup()
    
        await user.click(screen.getByText('view'))

        const button = screen.getByText('like')
        await user.click(button)
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)

    })

})