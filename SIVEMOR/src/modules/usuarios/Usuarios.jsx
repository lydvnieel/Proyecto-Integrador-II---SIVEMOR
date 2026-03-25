import { useEffect, useMemo, useState } from "react";
import Admin from "../../components/Admin";
import UserCard from "./components/UserCard";
import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import CreateUserSuccessModal from "./components/CreateUserSuccessModal";
import UpdateUserSuccessModal from "./components/UpdateUserSuccessModal";
import EmailSentModal from "./components/EmailSentModal";
import usersData from "../../data/usuarios.json";

export default function Usuarios() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : usersData;
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [emailUser, setEmailUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const nombre = String(user.nombre || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();
      const rol = String(user.rol || "").toLowerCase();

      return (
        !term ||
        nombre.includes(term) ||
        email.includes(term) ||
        rol.includes(term)
      );
    });
  }, [users, search]);

  const getInitials = (fullName) => {
    return String(fullName || "")
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
  };

  const handleCreateUser = (newUser) => {
    const createdUser = {
      ...newUser,
      id: Date.now(),
      ultimoAcceso: "-",
      estado: "Activo",
      estadoClass: "status-success",
      iniciales: getInitials(newUser.nombre),
      color: "#179CE6"
    };

    setUsers((prev) => [...prev, createdUser]);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
  };

  const handleSaveEdit = (updatedUser) => {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              ...updatedUser,
              iniciales: getInitials(updatedUser.nombre),
            }
          : user
      )
    );
  };

  const handleOpenEmail = (user) => {
    setEmailUser(user);
  };

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Usuarios</h2>
          <p className="page-title">Administración de técnicos y accesos</p>
        </div>

        <button
          className="primary-btn"
          data-bs-toggle="modal"
          data-bs-target="#createUserModal"
          type="button"
        >
          <i className="bi bi-person-plus"></i>&nbsp;Nuevo usuario
        </button>
      </div>

      <div className="panel-card mb-4">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por nombre, email o tipo de usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => handleOpenEdit(user)}
            onEmail={() => handleOpenEmail(user)}
          />
        ))}
      </div>

      <CreateUserModal onCreate={handleCreateUser} />
      <EditUserModal user={selectedUser} onSave={handleSaveEdit} />
      <CreateUserSuccessModal />
      <UpdateUserSuccessModal />
      <EmailSentModal user={emailUser} />
    </Admin>
  );
}