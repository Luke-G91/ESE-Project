import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
}

// TODO: move into api handling file
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // TODO: change to use axios
        const response = await fetch(`${apiUrl}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
