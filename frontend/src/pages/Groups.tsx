import { useState, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { createGroup, getAllGroups } from "../api/group";
import "./Groups.css";
import { toast } from "react-toastify";
import Group from "../components/Group";

const Groups = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups", user?.id],
    queryFn: getAllGroups,
    // disable api call when there is no user
    enabled: !!user,
  });

  const { mutate: createNewGroup } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      // invalidate query to get most recent group data after creating a group
      queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
      // reset form
      setNewGroup({ name: "", description: "" });
      toast.success("Group created successfully");
    },
    onError: (error) => {
      console.warn(error);
      toast.error("Failed to create group");
    },
  });

  // prevent default to stop form submissions from sending default form requests
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

  if (isLoading) {
    return <div className="loading">Loading groups...</div>;
  }

  return (
    <div className="groups-container">
      <h1 className="page-title">Your Groups</h1>
      <div className="groups-list">
        {groups && groups.length > 0 ? (
          groups.map((group) => <Group group={group} />)
        ) : (
          <div>You a not a member of any groups yet</div>
        )}
      </div>

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
    </div>
  );
};

export default Groups;
