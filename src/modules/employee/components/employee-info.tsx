import React from "react";

interface EmployeeInfoProps {
  user: {
    user: {
      name: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      imageUrl: string;
    };
    system: {
      name: string;
      address: string;
      id: string;
      adminId: string;
      bannerUrl: string | null;
      passkey: number;
      latitude: number;
      longitude: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ user }) => {
  const { user: userInfo, system } = user;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: 12,
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        {userInfo.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={userInfo.imageUrl}
            alt={`${userInfo.name ?? "User"}'s profile`}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Employee Info</h2>
          <p>
            <strong>Name:</strong> {userInfo.name ?? "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>User ID:</strong> {userInfo.id}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(userInfo.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(userInfo.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <hr style={{ margin: "2rem 0", borderColor: "#eee" }} />

      <div>
        <h3 style={{ marginBottom: "1rem" }}>System Info</h3>
        {system.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={system.bannerUrl}
            alt={`${system.name} banner`}
            style={{
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: "1rem",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            fontSize: 15,
            color: "#333",
          }}
        >
          <div style={{ flex: "1 1 300px" }}>
            <p>
              <strong>Name:</strong> {system.name}
            </p>
            <p>
              <strong>Address:</strong> {system.address}
            </p>
            <p>
              <strong>System ID:</strong> {system.id}
            </p>
            <p>
              <strong>Admin ID:</strong> {system.adminId}
            </p>
          </div>

          <div style={{ flex: "1 1 300px" }}>
            <p>
              <strong>Passkey:</strong> {system.passkey}
            </p>
            <p>
              <strong>Coordinates:</strong> {system.latitude}, {system.longitude}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(system.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(system.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
