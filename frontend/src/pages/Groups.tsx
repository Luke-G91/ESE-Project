import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { createGroup, getAllGroups } from "../api/group";
import "./Groups.css";

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

  if (isLoading) return <div className="loading">Loading groups...</div>;

  return (
    <div className="groups-container">
      <h2 className="create-group-title">Create New Group</h2>
      <form className="create-group-form" onSubmit={handleCreateGroup}>
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
        <button type="submit" className="btn">
          Create Group
        </button>
      </form>

      <h1 className="page-title">Your Groups</h1>
      <div className="groups-list">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group.id}
              className="group-card"
              onClick={() => navigate(`/group/${group.id}`)}
            >
              <h3 className="group-name">{group.name}</h3>
              <p className="group-description">{group.description}</p>
            </div>
          ))
        ) : (
          <div>You a not a member of any groups yet</div>
        )}
      </div>
    </div>
  );
};

export default Groups;
