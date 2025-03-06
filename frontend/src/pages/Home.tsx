import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, getAllPosts } from "../api/post";
import Post from "../components/Post";

const Home = () => {
  const navigate = useNavigate();
  const { user, refetch, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const { mutate: createNewPost } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    refetch();
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    createNewPost(newPost);
    setNewPost({ title: "", content: "" });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading || isPostsLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {user.name}!</p>

      <button onClick={handleLogout}>Logout</button>

      <h2>Posts</h2>

      <form onSubmit={handleCreatePost}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={newPost.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            name="content"
            value={newPost.content}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Post</button>
      </form>

      <h3>Post List</h3>
      <ul>{posts?.map((post) => <Post post={post} />)}</ul>
    </div>
  );
};

export default Home;
