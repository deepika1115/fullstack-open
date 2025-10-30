const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog)=>{
        return sum + blog.likes
    },0)
    return total
}

const favoriteBlog  = (blogs) => {
    if(blogs.length === 0){
        return null
    }
    return blogs.reduce((fav, blog) => {
        return blog.likes > fav.likes ? blog : fav
    })
}

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  
]

const mostBlogs = (blogs) => {
    // const obj = {}
    // let result = {author: '', blogs: 0}
    // blogs.forEach((blog)=>{
    //     if(blog.author in obj){
    //         obj[blog.author] ++
    //     }else{
    //         obj[blog.author] = 1
    //     }
    //     if(result?.blogs < obj[blog.author]){
    //         result = {author: blog.author, blogs :  obj[blog.author]}
    //     }
    // })
    // return result

    if(blogs.length === 0) return null

    const blogCountObj = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {})
    const [author, maxBlogsCount] = Object.entries(blogCountObj).reduce((max, entry) => {
        return entry[1] > max[1] ? entry : max
    })
    return {author, blogs: maxBlogsCount}
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) return null

    const blogLikesCount = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    },{})
    const [author, mostLikes] = Object.entries(blogLikesCount).reduce((max, entry) => {
        return entry[1] > max[1] ? entry : max
    })

    return {author, likes: mostLikes}
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}
