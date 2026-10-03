// import { Card, PageHeader, Input, Select, Button, Tabs } from "@/components/ui";

// const ProfileSettings = () => (
//   <Card>
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       <Input label="Full Name" defaultValue="Admin User" />
//       <Input label="Login ID" defaultValue="admin" disabled />
//       <Input label="Email Address" type="email" defaultValue="admin@vms2.com" />
//       <Input label="Phone Number" defaultValue="9876543210" />
//     </div>
//     <div className="mt-5 flex justify-end">
//       <Button>Save Changes</Button>
//     </div>
//   </Card>
// );

// const SecuritySettings = () => (
//   <Card>
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
//       <Input label="Current Password" type="password" placeholder="Enter current password" />
//       <div />
//       <Input label="New Password" type="password" placeholder="Enter new password" />
//       <Input label="Confirm New Password" type="password" placeholder="Re-enter new password" />
//     </div>
//     <div className="mt-5 flex justify-end">
//       <Button>Update Password</Button>
//     </div>
//   </Card>
// );

// const PreferenceSettings = () => (
//   <Card>
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
//       <Select
//         label="Default Site"
//         options={[
//           { label: "Tower A", value: "Tower A" },
//           { label: "Tower B", value: "Tower B" },
//         ]}
//         placeholder="Select site"
//       />
//       <Select
//         label="Theme"
//         options={[
//           { label: "Purple (Default)", value: "purple" },
//           { label: "System", value: "system" },
//         ]}
//         defaultValue="purple"
//       />
//       <Select
//         label="Date Format"
//         options={[
//           { label: "DD-MM-YYYY", value: "dd-mm-yyyy" },
//           { label: "MM-DD-YYYY", value: "mm-dd-yyyy" },
//         ]}
//         defaultValue="dd-mm-yyyy"
//       />
//       <Select
//         label="Notifications"
//         options={[
//           { label: "All Notifications", value: "all" },
//           { label: "Important Only", value: "important" },
//           { label: "None", value: "none" },
//         ]}
//         defaultValue="all"
//       />
//     </div>
//     <div className="mt-5 flex justify-end">
//       <Button>Save Preferences</Button>
//     </div>
//   </Card>
// );

// const Settings = () => {
//   return (
//     <div>
//       <PageHeader title="Settings" description="Manage your profile, security and application preferences." />
//       <Tabs
//         tabs={[
//           { key: "profile", label: "Profile", content: <ProfileSettings /> },
//           { key: "security", label: "Security", content: <SecuritySettings /> },
//           { key: "preferences", label: "Preferences", content: <PreferenceSettings /> },
//         ]}
//       />
//     </div>
//   );
// };

// export default Settings;


import { useState } from "react";
import { Card, PageHeader, Input, Select, Button, Tabs } from "@/components/ui";
import { useAuth } from "@/context/AuthContext"; // adjust path
import { API_BASE_URL } from "@/constants";





// profile_photo comes back as a relative path ("/media/...") so it needs the
// backend origin in front of it. new URL(...).origin strips any "/api" suffix.
const getPhotoUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  try {
    return `${new URL(API_BASE_URL).origin}${path}`;
  } catch {
    return path;
  }
};

const Avatar = ({
  src,
  firstName,
  lastName,
}: {
  src: string | null;
  firstName?: string;
  lastName?: string;
}) => {
  const [failed, setFailed] = useState(false);
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";

  if (!src || failed) {
    return (
      <div className="h-24 w-24 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-semibold">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Profile"
      onError={() => setFailed(true)}
      className="h-24 w-24 rounded-full object-cover border border-gray-200"
    />
  );
};

const ProfileSettings = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Card>
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          src={getPhotoUrl(user.profile_photo)}
          firstName={user.first_name}
          lastName={user.last_name}
        />
        <div>
          <p className="text-lg font-semibold">{user.full_name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" value={user.first_name} readOnly />
        <Input label="Last Name" value={user.last_name} readOnly />
        <Input label="Email Address" type="email" value={user.email} readOnly />
        <Input label="Gender" value={user.gender} readOnly />
      </div>
    </Card>
  );
};

const SecuritySettings = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Role" value={user.role} disabled />
          <Input label="Site" value={user.site} disabled />
          <Input label="Login ID" value={user.login_id} disabled />
        </div>
      </Card>

      {/* <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <Input label="Current Password" type="password" placeholder="Enter current password" />
          <div />
          <Input label="New Password" type="password" placeholder="Enter new password" />
          <Input label="Confirm New Password" type="password" placeholder="Re-enter new password" />
        </div>
        <div className="mt-5 flex justify-end">
          <Button>Update Password</Button>
        </div>
      </Card> */}
    </div>
  );
};

// PreferenceSettings stays the same

const Settings = () => (
  <div>
    <PageHeader title="Settings" description="Manage your profile, security and application preferences." />
    <Tabs
      tabs={[
        { key: "profile", label: "Profile", content: <ProfileSettings /> },
        { key: "security", label: "Security", content: <SecuritySettings /> },
        // { key: "preferences", label: "Preferences", content: <PreferenceSettings /> },
      ]}
    />
  </div>
);

export default Settings;