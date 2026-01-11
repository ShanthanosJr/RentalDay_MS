import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5003';

interface ProfileDetails {
  userId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
    userId: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    licenseNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  // Mock "Reputation" score for UI flavor
  const reputationScore = 85; 

  useEffect(() => {
    if (user) {
      if (user.profileDetails) {
        setProfileDetails(user.profileDetails);
      }
      // Reset avatar states when user changes
      setAvatarPreview(null);
      setSelectedAvatar(null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ensureAvatarUrl = (avatarPath: string | undefined | null, fallbackUsername?: string): string => {
    if (!avatarPath) {
      return fallbackUsername 
        ? `https://ui-avatars.com/api/?name=${fallbackUsername}&background=0D8ABC&color=fff&size=150`
        : `https://ui-avatars.com/api/?name=Default&background=0D8ABC&color=fff&size=150`;
    }
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/uploads')) return `${API_BASE_URL}${avatarPath}`;
    return avatarPath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('User not found');
      return;
    }
    
    try {
      // Update profile details first
      const response = await axios.put(`/api/users/profile/${user._id}`, {
        profileDetails
      });
      
      let updatedUser = { ...user, profileDetails: response.data.profileDetails };
      
      // If there's a new avatar, upload it
      if (selectedAvatar) {
        const formData = new FormData();
        formData.append('avatar', selectedAvatar);
        
        const avatarResponse = await axios.post(`/api/users/${user._id}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        updatedUser = { ...updatedUser, avatar: ensureAvatarUrl(avatarResponse.data.avatar) };
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setIsEditing(false);
        setMessage('');
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
  };

  if (!user) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>Loading Identity...</div>;
  }

  return (
    <div className="container py-5">
      
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h6 className="text-success fw-bold letter-spacing-2 mb-1">IDENTITY MANAGEMENT</h6>
          <h2 className="display-5 fw-bold mb-0">PILOT <span className="text-muted">DOSSIER</span></h2>
        </div>
        <div className="d-none d-md-block text-end">
          <small className="text-muted d-block">USER ID: {user.userId}</small>
          <span className="badge bg-success rounded-0">VERIFIED</span>
        </div>
      </div>

      <div className="row g-4">
        
        {/* --- LEFT COLUMN: IDENTITY CARD --- */}
        <div className="col-lg-4">
          <div className="card tech-card border-0 h-100 position-relative">
            <div className="card-body text-center pt-5">
              
              {/* Avatar with Tech Ring */}
              <div className="position-relative d-inline-block mb-4">
                 <div className="border border-2 border-success rounded-circle p-1">
                    <img 
                      src={ensureAvatarUrl(user.avatar, user.username)} 
                      alt="Profile" 
                      className="rounded-circle"
                      style={{width: '120px', height: '120px'}} 
                    />
                 </div>
                 <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2" title="Online"></div>
              </div>

              <h3 className="fw-bold mb-1">{user.username}</h3>
              <p className="text-muted mb-4">{user.email}</p>

              {/* Role Badge */}
              <div className="mb-4">
                 <span className={`badge rounded-0 py-2 px-3 ${user.role === 'admin' ? 'bg-danger' : 'bg-dark'}`}>
                    ROLE: {user.role.toUpperCase()}
                 </span>
              </div>

              {/* Mock Stats */}
              <div className="row g-2 text-start mt-4 pt-4 border-top">
                 <div className="col-12 mb-3">
                    <div className="d-flex justify-content-between mb-1">
                       <small className="fw-bold text-muted">REPUTATION SCORE</small>
                       <small className="fw-bold text-success">{reputationScore}/100</small>
                    </div>
                    <div className="progress" style={{height: '6px'}}>
                       <div className="progress-bar bg-success" role="progressbar" style={{width: `${reputationScore}%`}}></div>
                    </div>
                 </div>
                 <div className="col-6">
                    <div className="p-2 bg-light border">
                       <small className="d-block text-muted" style={{fontSize: '10px'}}>TOTAL TRIPS</small>
                       <span className="fw-bold">0</span>
                    </div>
                 </div>
                 <div className="col-6">
                    <div className="p-2 bg-light border">
                       <small className="d-block text-muted" style={{fontSize: '10px'}}>MEMBER SINCE</small>
                       <span className="fw-bold">2025</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: DETAILS & EDIT FORM --- */}
        <div className="col-lg-8">
          <div className="card tech-card border-0 h-100">
            <div className="card-body">
              
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                 <h5 className="fw-bold text-success mb-0">PERSONAL DATA</h5>
                 {!isEditing && (
                   <button 
                     className="btn btn-sm btn-outline-dark rounded-0 fw-bold" 
                     onClick={() => setIsEditing(true)}
                   >
                     EDIT DATA
                   </button>
                 )}
              </div>

              {message && (
                <div className={`alert rounded-0 border-0 ${message.includes('success') ? 'alert-success bg-success text-white' : 'alert-danger'}`}>
                  {message}
                </div>
              )}

              {isEditing ? (
                /* --- EDIT MODE (FORM) --- */
                <form onSubmit={handleSubmit} className="animate-fade-in">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">FIRST NAME</label>
                      <input
                        type="text"
                        className="form-control rounded-0"
                        name="firstName"
                        value={profileDetails.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">LAST NAME</label>
                      <input
                        type="text"
                        className="form-control rounded-0"
                        name="lastName"
                        value={profileDetails.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">CONTACT PHONE</label>
                      <input
                          type="text"
                          className="form-control rounded-0"
                          name="phone"
                          value={profileDetails.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">RESIDENTIAL ADDRESS</label>
                      <textarea
                        className="form-control rounded-0"
                        name="address"
                        value={profileDetails.address || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Full street address"
                      ></textarea>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">DATE OF BIRTH</label>
                      <input
                        type="date"
                        className="form-control rounded-0"
                        name="dateOfBirth"
                        value={profileDetails.dateOfBirth ? profileDetails.dateOfBirth.split('T')[0] : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">DRIVER'S LICENSE ID</label>
                      <input
                        type="text"
                        className="form-control rounded-0"
                        name="licenseNumber"
                        value={profileDetails.licenseNumber || ''}
                        onChange={handleInputChange}
                        placeholder="License number"
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">PROFILE PHOTO</label>
                      <input
                        type="file"
                        className="form-control rounded-0"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      {avatarPreview && (
                        <div className="mt-2">
                          <img src={avatarPreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%'}} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top">
                    <button type="button" className="btn btn-light rounded-0" onClick={() => setIsEditing(false)}>CANCEL</button>
                    <button type="submit" className="btn btn-success rounded-0 px-4">SAVE CHANGES</button>
                  </div>
                </form>
              ) : (
                /* --- VIEW MODE (DATA GRID) --- */
                <div className="row g-4 animate-fade-in">
                   <div className="col-md-6">
                      <div className="p-3 border bg-light h-100">
                         <small className="text-muted d-block mb-1" style={{fontSize: '10px'}}>FULL NAME</small>
                         <p className="fw-bold mb-0 text-dark">
                           {profileDetails.firstName || profileDetails.lastName 
                             ? `${profileDetails.firstName} ${profileDetails.lastName}` 
                             : <span className="text-muted fst-italic">Not Recorded</span>}
                         </p>
                      </div>
                   </div>

                   <div className="col-md-6">
                      <div className="p-3 border bg-light h-100">
                         <small className="text-muted d-block mb-1" style={{fontSize: '10px'}}>DATE OF BIRTH</small>
                         <p className="fw-bold mb-0 text-dark">
                            {profileDetails.dateOfBirth 
                              ? new Date(profileDetails.dateOfBirth).toLocaleDateString() 
                              : <span className="text-muted fst-italic">Not Recorded</span>}
                         </p>
                      </div>
                   </div>

                   <div className="col-md-6">
                      <div className="p-3 border bg-light h-100">
                         <small className="text-muted d-block mb-1" style={{fontSize: '10px'}}>DRIVER'S LICENSE</small>
                         <p className="fw-bold mb-0 text-dark">
                            {profileDetails.licenseNumber 
                              ? profileDetails.licenseNumber
                              : <span className="text-muted fst-italic">Not Recorded</span>}
                         </p>
                      </div>
                   </div>

                   <div className="col-md-12">
                      <div className="p-3 border bg-light h-100">
                         <small className="text-muted d-block mb-1" style={{fontSize: '10px'}}>CONTACT INFO</small>
                         <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-dark">
                               {profileDetails.phone || <span className="text-muted fst-italic">No Phone Linked</span>}
                            </span>
                            <span className="badge bg-success bg-opacity-10 text-success">PRIMARY</span>
                         </div>
                      </div>
                   </div>

                   <div className="col-md-12">
                      <div className="p-3 border bg-light h-100">
                         <small className="text-muted d-block mb-1" style={{fontSize: '10px'}}>REGISTERED ADDRESS</small>
                         <p className="fw-bold mb-0 text-dark">
                            {profileDetails.address || <span className="text-muted fst-italic">No Address on File</span>}
                         </p>
                      </div>
                   </div>
                   
                   {/* System Logs (Decorational) */}
                   <div className="col-12 mt-4">
                      <h6 className="text-muted fw-bold small mb-3">SYSTEM LOGS</h6>
                      <div className="bg-dark text-white p-3 font-monospace small" style={{fontSize: '11px', opacity: 0.8}}>
                         <div className="d-flex justify-content-between mb-1">
                            <span className="text-success">ACCESS_GRANTED</span>
                            <span>{new Date().toLocaleDateString()} 14:02:55</span>
                         </div>
                         <div className="d-flex justify-content-between mb-1">
                            <span className="text-success">DATA_SYNC</span>
                            <span>{new Date().toLocaleDateString()} 09:15:22</span>
                         </div>
                         <div className="d-flex justify-content-between">
                            <span className="text-secondary">ENCRYPTION_KEY</span>
                            <span>SHA-256 VERIFIED</span>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;