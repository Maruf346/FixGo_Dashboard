import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { AuthUser, ProfileData, getAdminProfile, updateAdminProfile, loadStoredAuth } from "../../services/auth";

type Language = "EN" | "FR";

interface ProfileProps {
  lang: Language;
  user: AuthUser | null;
}

// Previous mock data kept for future reference:
// const INITIAL_PROFILE: ProfileData = {
//   fullName: "John",
//   lastName: "Doe",
//   phoneNumber: "+1 234 567 890",
//   email: "john.doe@gmail.com",
//   avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
// };

export default function Profile({ lang, user }: ProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<{ full_name: string; phone: string; profile_picture: File | null }>({
    full_name: "",
    phone: "",
    profile_picture: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    profile: lang === "EN" ? "Profile" : "Profil",
    editProfile: lang === "EN" ? "Edit Profile" : "Modifier le profil",
    fullName: lang === "EN" ? "Full Name" : "Nom complet",
    phoneNumber: lang === "EN" ? "Phone Number" : "Numéro de téléphone",
    email: lang === "EN" ? "Email" : "Courriel",
    updateProfile: lang === "EN" ? "Update Profile" : "Mettre à jour le profil",
    save: lang === "EN" ? "Save" : "Enregistrer",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
    loading: lang === "EN" ? "Loading..." : "Chargement...",
    saving: lang === "EN" ? "Saving..." : "Enregistrement...",
    error: lang === "EN" ? "Error loading profile" : "Erreur lors du chargement du profil",
    updateError: lang === "EN" ? "Error updating profile" : "Erreur lors de la mise à jour du profil",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { accessToken } = loadStoredAuth();
      if (!accessToken) {
        setError(t.error);
        setLoading(false);
        return;
      }

      try {
        const data = await getAdminProfile(accessToken);
        setProfile(data);
        setEditedProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          profile_picture: null,
        });
      } catch (err) {
        setError(t.error);
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t.error]);

  const handleEdit = () => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        profile_picture: null,
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    const { accessToken } = loadStoredAuth();
    if (!accessToken) {
      setError(t.updateError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedData = await updateAdminProfile(accessToken, editedProfile);
      setProfile(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(t.updateError);
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        profile_picture: null,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditedProfile({ ...editedProfile, profile_picture: file });
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-[#1b457c] rounded-2xl px-6 py-5 shadow-sm">
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
              {t.loading}
            </h1>
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-[#1b457c] rounded-2xl px-6 py-5 shadow-sm">
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
              {t.profile}
            </h1>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) return null;

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
                src={isEditing && editedProfile.profile_picture ? URL.createObjectURL(editedProfile.profile_picture) : (profile.profile_picture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format")}
                alt={profile.full_name || "Admin"}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-9 h-9 bg-[#d9d9d9] rounded-full flex items-center justify-center shadow-md hover:bg-gray-300 transition-colors cursor-pointer">
                  <Camera size={18} className="text-[#6f6f6f]" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h2
              className="text-2xl font-bold text-[#101010] capitalize"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {profile.full_name || (lang === "EN" ? "Admin" : "Admin")}
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
          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-lg font-semibold text-[#1e1e1e] mb-2 capitalize"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t.fullName}
              </label>
              <input
                id="fullName"
                type="text"
                value={isEditing ? editedProfile.full_name : (profile.full_name || "")}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, full_name: e.target.value })
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
                value={isEditing ? editedProfile.phone : (profile.phone || "")}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, phone: e.target.value })
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
                  disabled={saving}
                  className="flex-1 py-3 text-white rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {saving ? t.saving : t.save}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 py-3 bg-white border-2 border-[#1b457c] text-[#1b457c] rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all disabled:cursor-not-allowed disabled:opacity-70"
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