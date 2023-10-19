import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'

export default function UserPage({}) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    )
}
