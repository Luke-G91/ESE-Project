import { useNavigate } from "react-router-dom";
import { GroupViewModel } from "../api/models/group/ViewGroupModel";
import "./Group.css";

type GroupProps = {
  group: GroupViewModel;
};

const Group = ({ group }: GroupProps) => {
  const navigate = useNavigate();
  return (
    <div
      key={group.id}
      className="group-card"
      onClick={() => navigate(`/group/${group.id}`)}
    >
      <h3 className="group-name">{group.name}</h3>
      <p className="group-description">{group.description}</p>
    </div>
  );
};

export default Group;
