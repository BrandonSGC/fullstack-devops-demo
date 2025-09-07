import './ListUsers.css';
export const ListUsers = ({ users }) => {
  return (
    <>
      <h2>Users List</h2>
      <ul className="users__list">
        {users.map((user) => (
          <li key={user.id}>
            {user.name} {user.surname} - {user.email}
          </li>
        ))}
      </ul>
    </>
  );
};
