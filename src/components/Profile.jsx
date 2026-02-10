import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getProfile, updateProfile } from "../services/api";

const CLOUDINARY_UPLOAD_URL = (cloudName) =>
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export default function Profile() {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setEmail(profile.email || "");
        setImageUrl(profile.image_url || "");
        setImagePublicId(profile.image_public_id || "");
      } catch (err) {
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isLoggedIn]);

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary is not configured.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(CLOUDINARY_UPLOAD_URL(cloudName), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Cloudinary upload failed.");
    }

    return response.json();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setStatus("");
    setUploading(true);

    try {
      const uploadResult = await uploadToCloudinary(file);
      setImageUrl(uploadResult.secure_url || "");
      setImagePublicId(uploadResult.public_id || "");
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    try {
      const payload = {
        email,
        image_url: imageUrl,
        image_public_id: imagePublicId,
      };
      const updated = await updateProfile(payload);
      setEmail(updated.email || "");
      setImageUrl(updated.image_url || "");
      setImagePublicId(updated.image_public_id || "");
      setStatus("Profile updated successfully.");
    } catch (err) {
      const message = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Unable to update profile.";
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="todoapp stack-large">
        <h1>Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="todoapp stack-large">
        <h1>Profile</h1>
        <p>
          Please <Link to="/login">log in</Link> to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="todoapp stack-large">
      <h1>Profile</h1>
      {status && <p className="success-message">{status}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="stack-small">
        {imageUrl ? (
          <img src={imageUrl} alt="Profile" width="120" height="120" />
        ) : (
          <div>No profile image yet.</div>
        )}
      </div>

      <form onSubmit={handleSave} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="input__lg"
        />

        <input
          type="file"
          name="profile_image"
          accept="image/*"
          onChange={handleFileChange}
          className="input__lg"
        />

        <button
          type="submit"
          className="btn btn__primary btn__lg"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
