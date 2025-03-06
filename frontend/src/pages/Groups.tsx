import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { createGroup, getAllGroups } from "../api/group";

const Groups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups", user?.id],
    queryFn: getAllGroups,
    enabled: !!user,
  });

  const { mutate: createNewGroup } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
      setNewGroup({ name: "", description: "" });
    },
  });

  const handleCreateGroup = (e: FormEvent) => {
    e.preventDefault();
    createNewGroup(newGroup);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>Loading groups...</div>;

  return (
    <div>
      <h1>Your Groups</h1>
      <button onClick={() => navigate("/home")}>Home</button>
      <ul>
        {groups?.map((group) => (
          <li key={group.id}>
            <span
              onClick={() => navigate(`/group/${group.id}`)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              {group.name}
            </span>
          </li>
        ))}
      </ul>
      <h2>Create New Group</h2>
      <form onSubmit={handleCreateGroup}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newGroup.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={newGroup.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default Groups;
