import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component', ()=> {
    test('calls event handler it received as props with the right details when a new blog is created', async() => {
        const mockHandler = vi.fn()

        const user = userEvent.setup()

        render(<BlogForm createBlog={mockHandler} />)

        const titleInput = screen.getByLabelText('title')
        const authorInput = screen.getByLabelText('author')
        const urlInput = screen.getByLabelText('url')

        const createButton = screen.getByText('create')

        await user.type(titleInput, 'new blog')
        await user.type(authorInput, 'new author')
        await user.type(urlInput, 'https://www.newexample.com')

        await user.click(createButton)

        expect(mockHandler.mock.calls).toHaveLength(1)
        expect(mockHandler).toHaveBeenCalledWith({
            title: 'new blog',
            author: 'new author',
            url: 'https://www.newexample.com'
        })
    })
})