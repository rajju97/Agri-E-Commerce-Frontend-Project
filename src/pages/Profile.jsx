import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/db';

const Profile = () => {
    const { currentUser, userRole } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        displayName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    useEffect(() => {
        const load = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const data = await getUserProfile(currentUser.uid);
                setProfile(data);
                if (data) {
                    setFormData({
                        displayName: data.displayName || '',
                        phone: data.mobile || data.phone || '',
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        pincode: data.pincode || '',
                    });
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateUserProfile(currentUser.uid, {
                displayName: formData.displayName,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
            });
            setEditing(false);
            // Refresh
            const data = await getUserProfile(currentUser.uid);
            setProfile(data);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Avatar / Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                        {(currentUser?.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{formData.displayName || currentUser?.email}</h2>
                        <p className="text-gray-500">{currentUser?.email}</p>
                        <span className="badge badge-primary text-white mt-1">{userRole?.toUpperCase()}</span>
                    </div>
                </div>

                {editing ? (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Display Name</label>
                            <input type="text" name="displayName" value={formData.displayName}
                                onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input type="tel" name="phone" value={formData.phone}
                                onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea name="address" value={formData.address}
                                onChange={handleChange} className="textarea textarea-bordered w-full" rows="2" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input type="text" name="city" value={formData.city}
                                    onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <input type="text" name="state" value={formData.state}
                                    onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Pincode</label>
                                <input type="text" name="pincode" value={formData.pincode}
                                    onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={saving} className="btn btn-primary">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost">
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{currentUser?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{profile?.mobile || profile?.phone || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="font-medium capitalize">{userRole}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Display Name</p>
                                <p className="font-medium">{profile?.displayName || 'Not set'}</p>
                            </div>
                        </div>

                        {(profile?.address || profile?.city) && (
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">
                                    {[profile?.address, profile?.city, profile?.state, profile?.pincode].filter(Boolean).join(', ')}
                                </p>
                            </div>
                        )}

                        <button onClick={() => setEditing(true)} className="btn btn-primary mt-4">
                            <i className="fas fa-edit mr-2"></i> Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
