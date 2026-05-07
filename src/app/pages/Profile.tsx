import { useState } from "react";
import { Camera } from "lucide-react";

type Language = "EN" | "FR";

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  avatar: string;
}

const INITIAL_PROFILE: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+1 234 567 890",
  email: "john.doe@gmail.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
};

export default function Profile({ lang }: { lang: Language }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(INITIAL_PROFILE);

  const t = {
    profile: lang === "EN" ? "Profile" : "Profil",
    editProfile: lang === "EN" ? "Edit Profile" : "Modifier le profil",
    firstName: lang === "EN" ? "First Name" : "Prénom",
    lastName: lang === "EN" ? "Last Name" : "Nom",
    phoneNumber: lang === "EN" ? "Phone Number" : "Numéro de téléphone",
    email: lang === "EN" ? "Email" : "Courriel",
    updateProfile: lang === "EN" ? "Update Profile" : "Mettre à jour le profil",
    save: lang === "EN" ? "Save" : "Enregistrer",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-[#1b457c] rounded-2xl px-6 py-5 shadow-sm">
          <h1
            className="text-white text-2xl font-semibold"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {t.profile}
          </h1>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-9 h-9 bg-[#d9d9d9] rounded-full flex items-center justify-center shadow-md hover:bg-gray-300 transition-colors">
                  <Camera size={18} className="text-[#6f6f6f]" />
                </button>
              )}
            </div>
            <h2
              className="text-2xl font-bold text-[#101010] capitalize"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {profile.firstName} {profile.lastName}
            </h2>
          </div>
        </div>

        {/* Edit Profile Button (only visible when not editing) */}
        {!isEditing && (
          <div className="flex justify-center">
            <button
              onClick={handleEdit}
              className="text-[#1b457c] font-semibold text-base underline decoration-solid hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {t.editProfile}
            </button>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 lg:px-60 lg:py-6">
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-lg font-semibold text-[#1e1e1e] mb-2 capitalize"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t.firstName}
              </label>
              <input
                id="firstName"
                type="text"
                value={isEditing ? editedProfile.firstName : profile.firstName}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, firstName: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-3 border ${
                  isEditing ? "border-[#919191] bg-white" : "border-[#e5e7eb] bg-[#f9fafb]"
                } rounded text-base ${
                  isEditing ? "text-[#111827]" : "text-[#6b7280]"
                } focus:outline-none focus:ring-2 focus:ring-[#1b457c]/20 focus:border-[#1b457c] transition-all`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-lg font-semibold text-[#1e1e1e] mb-2 capitalize"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t.lastName}
              </label>
              <input
                id="lastName"
                type="text"
                value={isEditing ? editedProfile.lastName : profile.lastName}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, lastName: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-3 border ${
                  isEditing ? "border-[#919191] bg-white" : "border-[#e5e7eb] bg-[#f9fafb]"
                } rounded text-base ${
                  isEditing ? "text-[#111827]" : "text-[#6b7280]"
                } focus:outline-none focus:ring-2 focus:ring-[#1b457c]/20 focus:border-[#1b457c] transition-all`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-lg font-semibold text-[#1e1e1e] mb-2 capitalize"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t.phoneNumber}
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={isEditing ? editedProfile.phoneNumber : profile.phoneNumber}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-3 border ${
                  isEditing ? "border-[#919191] bg-white" : "border-[#e5e7eb] bg-[#f9fafb]"
                } rounded text-base ${
                  isEditing ? "text-[#111827]" : "text-[#6b7280]"
                } focus:outline-none focus:ring-2 focus:ring-[#1b457c]/20 focus:border-[#1b457c] transition-all`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Email (Always Non-Editable) */}
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-semibold text-[#1e1e1e] mb-2 capitalize"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 border border-[#e5e7eb] bg-[#f9fafb] rounded text-base text-[#6b7280] cursor-not-allowed"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 text-white rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition-all"
                  style={{
                    background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {t.save}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-white border-2 border-[#1b457c] text-[#1b457c] rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {t.cancel}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEdit}
                className="w-full py-3 text-white rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition-all capitalize"
                style={{
                  background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {t.updateProfile}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
