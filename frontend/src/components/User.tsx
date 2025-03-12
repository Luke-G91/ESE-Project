import UserViewModel from "../api/models/user/UserViewModel";
import "./User.css";

type UserProps = {
  user: UserViewModel;
  currentUser: UserViewModel;
  handleRemoveUser: (id: number) => void;
};

const User = ({ user, currentUser, handleRemoveUser }: UserProps) => {
  return (
    <li key={user.id} className="user-item">
      - {user.name} ({user.email})
      {user.id !== currentUser.id && (
        <button
          className="btn-remove"
          onClick={() => handleRemoveUser(user.id)}
        >
          Remove
        </button>
      )}
    </li>
  );
};

export default User;
