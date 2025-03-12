import { useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
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
import "./GroupDetails.css";

const GroupDetails = () => {
  const { groupId } = useParams();
  const groupIdNumber = Number(groupId);
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
    onError: (error) => {
      console.warn(error);
    },
  });

  const { mutate: addNewUser } = useMutation({
    mutationFn: (email: string) => addUserToGroup(groupIdNumber, email),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", groupIdNumber],
      });
      setNewUserEmail("");
    },
    onError: (error) => {
      console.warn(error);
    },
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: (userId: number) => deleteUserFromGroup(groupIdNumber, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", groupIdNumber],
      });
    },
    onError: (error) => {
      console.warn(error);
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
    <div className="group-details-container">
      <h1 className="page-title">{group?.name}</h1>
      <div>{group?.description}</div>
      <div className="tabs">
        <span
          className={`tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </span>
        <span
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </span>
      </div>
      {activeTab === "posts" && (
        <div className="posts-section">
          {isGroupPostsLoading ? (
            <div className="loading">Loading posts...</div>
          ) : (
            <div className="posts-list-container">
              <ul className="post-list">
                {groupPosts && groupPosts.length > 0 ? (
                  groupPosts?.map((post) => (
                    <li key={post.id}>
                      <Post post={post} groupId={groupIdNumber} />
                    </li>
                  ))
                ) : (
                  <div>There are no posts for this group</div>
                )}
              </ul>
            </div>
          )}

          <h3 className="create-post-title">Create New Post</h3>
          <form className="post-form" onSubmit={handleCreatePost}>
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
            <button type="submit" className="btn">
              Create Post
            </button>
          </form>
        </div>
      )}
      {activeTab === "users" && (
        <div className="users-section">
          {isGroupLoading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <ul className="user-list">
              {group?.users.map((u) => (
                <li key={u.id} className="user-item">
                  - {u.name} ({u.email})
                  {u.id !== user.id && (
                    <button
                      className="btn-remove"
                      onClick={() => removeUser(u.id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <h3 className="add-user-title">Add User to Group</h3>
          <form className="add-user-form" onSubmit={handleAddUser}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">
              Add User
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
