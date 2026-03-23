import { useState } from "react";
import Admin from "../../components/Admin";
import UserCard from "./components/UserCard";
import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import CreateUserSuccessModal from "./components/CreateUserSuccessModal";
import UpdateUserSuccessModal from "./components/UpdateUserSuccessModal";
import EmailSentModal from "./components/EmailSentModal";
import CurrentCredentialModal from "./components/CurrentCredentialModal";

export default function Usuarios() {
  const [users, setUsers] = useState([
    {
      id: 1,
      nombre: "Admin Principal",
      email: "admin@veritrack.mx",
      telefono: "+52 777 111 2233",
      rol: "Admin",
      verificentro: "Corporativo",
      ultimoAcceso: "2026-02-16 09:00",
      estado: "Activo",
      estadoClass: "status-success",
      iniciales: "AD",
      color: "#5B5CE2",
      password: "BK05IMY5",
    },
    {
      id: 2,
      nombre: "Juan Técnico",
      email: "juan@veritrack.mx",
      telefono: "+52 123 456 7890",
      rol: "Técnico",
      verificentro: "Monterrey Norte",
      ultimoAcceso: "2026-02-15 14:30",
      estado: "Activo",
      estadoClass: "status-success",
      iniciales: "JU",
      color: "#179CE6",
      password: "B7H4U5SD",
    },
    {
      id: 3,
      nombre: "Maria Técnica",
      email: "maria@veritrack.mx",
      telefono: "+52 999 123 4567",
      rol: "Técnico",
      verificentro: "Monterrey Sur",
      ultimoAcceso: "2026-01-20 10:15",
      estado: "Inactivo",
      estadoClass: "status-neutral",
      iniciales: "MA",
      color: "#179CE6",
      password: "QW12ER45",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [credentialUser, setCredentialUser] = useState(null);
  const [emailUser, setEmailUser] = useState(null);
  const [createdPassword, setCreatedPassword] = useState("");

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateUser = (newUser) => {
    const password = generatePassword();

    const createdUser = {
      ...newUser,
      id: Date.now(),
      ultimoAcceso: "-",
      estado: "Activo",
      estadoClass: "status-success",
      iniciales: getInitials(newUser.nombre),
      color: "#179CE6",
      password,
    };

    setUsers((prev) => [...prev, createdUser]);
    setCreatedPassword(password);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
  };

  const handleSaveEdit = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleOpenCredential = (user) => {
    setCredentialUser(user);
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
        >
          <i className="bi bi-person-plus"></i>&nbsp;Nuevo usuario
        </button>
      </div>

      <div className="users-grid">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => handleOpenEdit(user)}
            onCredential={() => handleOpenCredential(user)}
            onEmail={() => handleOpenEmail(user)}
          />
        ))}
      </div>

      <CreateUserModal onCreate={handleCreateUser} />
      <EditUserModal user={selectedUser} onSave={handleSaveEdit} />
      <CreateUserSuccessModal password={createdPassword} />
      <UpdateUserSuccessModal />
      <EmailSentModal user={emailUser} />
      <CurrentCredentialModal user={credentialUser} />
    </Admin>
  );
}