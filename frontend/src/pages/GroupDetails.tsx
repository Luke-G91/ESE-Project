import { useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import Post from "../components/Post";
import {
  addUserToGroup,
  deleteUserFromGroup,
  getGroup,
  getGroupPosts,
} from "../api/group";
import { createPost } from "../api/post";

const GroupDetails = () => {
  const { groupId } = useParams();
  const groupIdNumber = Number(groupId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("posts");
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newUserEmail, setNewUserEmail] = useState("");

  const { data: group, isLoading: isGroupLoading } = useQuery({
    queryKey: ["group", groupIdNumber],
    queryFn: () => getGroup(groupIdNumber),
    enabled: !!groupIdNumber,
  });

  const { data: groupPosts, isLoading: isGroupPostsLoading } = useQuery({
    queryKey: ["groupPosts", groupIdNumber],
    queryFn: () => getGroupPosts(groupIdNumber),
    enabled: !!groupIdNumber,
  });

  const { mutate: createNewPost } = useMutation({
    mutationFn: (postData: {
      title: string;
      content: string;
      groupId: number;
    }) => createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupPosts", groupIdNumber],
      });
      setNewPost({ title: "", content: "" });
    },
  });

  const { mutate: addNewUser } = useMutation({
    mutationFn: (email: string) => addUserToGroup(groupIdNumber, email),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupUsers", groupIdNumber],
      });
      setNewUserEmail("");
    },
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: (userId: number) => deleteUserFromGroup(groupIdNumber, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupUsers", groupIdNumber],
      });
    },
  });

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    createNewPost({ ...newPost, groupId: groupIdNumber });
  };

  const handlePostChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e: FormEvent) => {
    e.preventDefault();
    addNewUser(newUserEmail);
  };

  if (!groupIdNumber || !user) return <div>Group not found</div>;

  return (
    <div>
      <button onClick={() => navigate("/groups")}>Back to Groups</button>
      <h1>Group Details</h1>
      <div>
        <button onClick={() => setActiveTab("posts")}>Posts</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
      </div>
      {activeTab === "posts" && (
        <div>
          <h2>Group Posts</h2>
          {isGroupPostsLoading ? (
            <div>Loading posts...</div>
          ) : (
            <ul>
              {groupPosts?.map((post) => (
                <li key={post.id}>
                  <Post post={post} groupId={groupIdNumber} />
                </li>
              ))}
            </ul>
          )}
          <h3>Create New Post</h3>
          <form onSubmit={handleCreatePost}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newPost.title}
                onChange={handlePostChange}
                required
              />
            </div>
            <div>
              <label>Content:</label>
              <textarea
                name="content"
                value={newPost.content}
                onChange={handlePostChange}
                required
              />
            </div>
            <button type="submit">Create Post</button>
          </form>
        </div>
      )}
      {activeTab === "users" && (
        <div>
          <h2>Group Users</h2>
          {isGroupLoading ? (
            <div>Loading users...</div>
          ) : (
            <ul>
              {group?.users.map((u) => (
                <li key={u.id}>
                  {u.name} ({u.email})
                  {u.id !== user.id && (
                    <button onClick={() => removeUser(u.id)}>Remove</button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <h3>Add User to Group</h3>
          <form onSubmit={handleAddUser}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Add User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
