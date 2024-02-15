import React, { useState, useEffect } from 'react';
import './App.css';

import { GoHeart, GoHeartFill } from "react-icons/go";
import { BiEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [users, setUsers] = useState([]);
  const [likedUsers, setLikedUsers] = useState([])
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    domail: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    email: '',
    phone: '',
    domain: ''
  });


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://dummyjson.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const toggleLike = (userId) => {
    if (likedUsers.includes(userId)) {
      setLikedUsers(likedUsers.filter(id => id !== userId));
    } else {
      setLikedUsers([...likedUsers, userId]);
    }
  };

  const deleteUser = (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const openEditPopup = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    setEditedUser(userToEdit);
    setEditingUserId(userId);
    setValidationErrors({
      firstName: '',
      email: '',
      phone: '',
      domain: ''
    });

  };

  const closeEditPopup = () => {
    setEditingUserId(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    
    // Validation for Name
    if (name === 'firstName') {
      error = !value.trim() ? 'This field is required' : '';
    }
    
    // Validation for Email
    if (name === 'email') {
      error = !value.trim() ? 'This field is required' : (!isValidEmail(value) ? 'Invalid email' : '');
    }
    
    // Validation for Phone
  if (name === 'phone') {
    // Regular expression pattern to allow numbers, spaces, "+", "-", and any other necessary characters
    const validPhonePattern = /^[\d\s+\-]*$/;
    error = !value.trim() ? 'This field is required' : (!validPhonePattern.test(value) ? 'Invalid phone number' : '');
  }
    
    // Validation for Website
    if (name === 'domain') {
      error = !value.trim() ? 'This field is required' : '';
    }
    
    // Update validation error for the corresponding field
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
    
    // Update the editedUser state
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };
  

  const submitEditedUser = () => {
    const errors = {};
    
    // Validation for Name
    if (!editedUser || !editedUser.firstName || !editedUser.firstName.trim()) {
      errors.firstName = 'This field is required';
    }
  
    // Validation for Email
    if (!editedUser || !editedUser.email || !editedUser.email.trim()) {
      errors.email = 'This field is required';
    } else if (!isValidEmail(editedUser.email)) {
      errors.email = 'Invalid email';
    }
  
    // Validation for Phone
  if (!editedUser || !editedUser.phone || !editedUser.phone.trim()) {
    errors.phone = 'This field is required';
  } else if (!/^[\d\s+\-]*$/.test(editedUser.phone)) {
    errors.phone = 'Please enter only numbers, spaces, +, or -';
  }

  // Validation for Website
  if (!editedUser || !editedUser.domain || !editedUser.domain.trim()) {
    errors.domain = 'This field is required';
    
  }
  
  // Update validation errors state
  setValidationErrors(errors);

  // If there are no validation errors, submit the edited user
  if (Object.keys(errors).length === 0) {
    setUsers(users.map(user => user.id === editedUser.id ? editedUser : user));
    closeEditPopup();
  }

  };
  
  
  

  const isValidEmail = (email) => {
    // Basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="App">
      <h1 className='title'>User Data</h1>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className='user-image-card'><img src={user.image} alt={user.name} /></div>
            <div className="user-details">
              <h3>{`${user.firstName} ${user.lastName}`}</h3>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <i aria-label="icon: mail" className="anticon anticon-mail" style={{ fontSize: '18px' }}>
                  <svg viewBox="64 64 896 896"  data-icon="mail" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0 0 68.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z"></path></svg>
                </i>
                {user.email}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <i aria-label="icon: phone" className="anticon anticon-phone" style={{ fontSize: '18px' }}><svg viewBox="64 64 896 896"  data-icon="phone" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7a405.46 405.46 0 0 1-86.4 127.3c-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3a68.2 68.2 0 0 0-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4zm-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 .9.9 21.6-8a481.29 481.29 0 0 0 285.7-285.8l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z"></path></svg>
                </i>
                {user.phone}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <i aria-label="icon: global" className="anticon anticon-global" style={{ fontSize: '18px' }}><svg viewBox="64 64 896 896"  data-icon="global" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M854.4 800.9c.2-.3.5-.6.7-.9C920.6 722.1 960 621.7 960 512s-39.4-210.1-104.8-288c-.2-.3-.5-.5-.7-.8-1.1-1.3-2.1-2.5-3.2-3.7-.4-.5-.8-.9-1.2-1.4l-4.1-4.7-.1-.1c-1.5-1.7-3.1-3.4-4.6-5.1l-.1-.1c-3.2-3.4-6.4-6.8-9.7-10.1l-.1-.1-4.8-4.8-.3-.3c-1.5-1.5-3-2.9-4.5-4.3-.5-.5-1-1-1.6-1.5-1-1-2-1.9-3-2.8-.3-.3-.7-.6-1-1C736.4 109.2 629.5 64 512 64s-224.4 45.2-304.3 119.2c-.3.3-.7.6-1 1-1 .9-2 1.9-3 2.9-.5.5-1 1-1.6 1.5-1.5 1.4-3 2.9-4.5 4.3l-.3.3-4.8 4.8-.1.1c-3.3 3.3-6.5 6.7-9.7 10.1l-.1.1c-1.6 1.7-3.1 3.4-4.6 5.1l-.1.1c-1.4 1.5-2.8 3.1-4.1 4.7-.4.5-.8.9-1.2 1.4-1.1 1.2-2.1 2.5-3.2 3.7-.2.3-.5.5-.7.8C103.4 301.9 64 402.3 64 512s39.4 210.1 104.8 288c.2.3.5.6.7.9l3.1 3.7c.4.5.8.9 1.2 1.4l4.1 4.7c0 .1.1.1.1.2 1.5 1.7 3 3.4 4.6 5l.1.1c3.2 3.4 6.4 6.8 9.6 10.1l.1.1c1.6 1.6 3.1 3.2 4.7 4.7l.3.3c3.3 3.3 6.7 6.5 10.1 9.6 80.1 74 187 119.2 304.5 119.2s224.4-45.2 304.3-119.2a300 300 0 0 0 10-9.6l.3-.3c1.6-1.6 3.2-3.1 4.7-4.7l.1-.1c3.3-3.3 6.5-6.7 9.6-10.1l.1-.1c1.5-1.7 3.1-3.3 4.6-5 0-.1.1-.1.1-.2 1.4-1.5 2.8-3.1 4.1-4.7.4-.5.8-.9 1.2-1.4a99 99 0 0 0 3.3-3.7zm4.1-142.6c-13.8 32.6-32 62.8-54.2 90.2a444.07 444.07 0 0 0-81.5-55.9c11.6-46.9 18.8-98.4 20.7-152.6H887c-3 40.9-12.6 80.6-28.5 118.3zM887 484H743.5c-1.9-54.2-9.1-105.7-20.7-152.6 29.3-15.6 56.6-34.4 81.5-55.9A373.86 373.86 0 0 1 887 484zM658.3 165.5c39.7 16.8 75.8 40 107.6 69.2a394.72 394.72 0 0 1-59.4 41.8c-15.7-45-35.8-84.1-59.2-115.4 3.7 1.4 7.4 2.9 11 4.4zm-90.6 700.6c-9.2 7.2-18.4 12.7-27.7 16.4V697a389.1 389.1 0 0 1 115.7 26.2c-8.3 24.6-17.9 47.3-29 67.8-17.4 32.4-37.8 58.3-59 75.1zm59-633.1c11 20.6 20.7 43.3 29 67.8A389.1 389.1 0 0 1 540 327V141.6c9.2 3.7 18.5 9.1 27.7 16.4 21.2 16.7 41.6 42.6 59 75zM540 640.9V540h147.5c-1.6 44.2-7.1 87.1-16.3 127.8l-.3 1.2A445.02 445.02 0 0 0 540 640.9zm0-156.9V383.1c45.8-2.8 89.8-12.5 130.9-28.1l.3 1.2c9.2 40.7 14.7 83.5 16.3 127.8H540zm-56 56v100.9c-45.8 2.8-89.8 12.5-130.9 28.1l-.3-1.2c-9.2-40.7-14.7-83.5-16.3-127.8H484zm-147.5-56c1.6-44.2 7.1-87.1 16.3-127.8l.3-1.2c41.1 15.6 85 25.3 130.9 28.1V484H336.5zM484 697v185.4c-9.2-3.7-18.5-9.1-27.7-16.4-21.2-16.7-41.7-42.7-59.1-75.1-11-20.6-20.7-43.3-29-67.8 37.2-14.6 75.9-23.3 115.8-26.1zm0-370a389.1 389.1 0 0 1-115.7-26.2c8.3-24.6 17.9-47.3 29-67.8 17.4-32.4 37.8-58.4 59.1-75.1 9.2-7.2 18.4-12.7 27.7-16.4V327zM365.7 165.5c3.7-1.5 7.3-3 11-4.4-23.4 31.3-43.5 70.4-59.2 115.4-21-12-40.9-26-59.4-41.8 31.8-29.2 67.9-52.4 107.6-69.2zM165.5 365.7c13.8-32.6 32-62.8 54.2-90.2 24.9 21.5 52.2 40.3 81.5 55.9-11.6 46.9-18.8 98.4-20.7 152.6H137c3-40.9 12.6-80.6 28.5-118.3zM137 540h143.5c1.9 54.2 9.1 105.7 20.7 152.6a444.07 444.07 0 0 0-81.5 55.9A373.86 373.86 0 0 1 137 540zm228.7 318.5c-39.7-16.8-75.8-40-107.6-69.2 18.5-15.8 38.4-29.7 59.4-41.8 15.7 45 35.8 84.1 59.2 115.4-3.7-1.4-7.4-2.9-11-4.4zm292.6 0c-3.7 1.5-7.3 3-11 4.4 23.4-31.3 43.5-70.4 59.2-115.4 21 12 40.9 26 59.4 41.8a373.81 373.81 0 0 1-107.6 69.2z"></path></svg>
                </i>
                {user.domain}
              </div>

            </div>
            <div className="user-actions">
              <div className='action-btn'>
                {likedUsers.includes(user.id) ?
                  <div className='actions' onClick={() => toggleLike(user.id)}><GoHeartFill size={20} style={{ color: 'red' }} /></div>
                  :
                  <div className='actions' onClick={() => toggleLike(user.id)}><GoHeart size={20} style={{ color: 'red' }} /></div>
                }
              </div>
              <div className='action-btn'>
                <div className='actions-secondary' onClick={() => openEditPopup(user.id)}><BiEditAlt size={20}  /></div>
              </div>
              <div className='action-btn'>
                <div className='actions-secondary' onClick={() => deleteUser(user.id)}><AiFillDelete size={20} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingUserId && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <div className="edit-popup-header">
              <div className="edit-popup-title">Editing user no.{editingUserId} </div>
              <button className="close-button" onClick={closeEditPopup}>X</button>
            </div>
            
            <form className='form-body'>
              <div className="edit-popup-input">
                <label htmlFor="firstName"><span>*</span>Name: </label>
                <div style={{width:'100%'}}>
                <input type="text" id="firstName" name="firstName" value={editedUser.firstName} onChange={handleEditInputChange} className={validationErrors.firstName  ? 'error-input' : 'input'}/>
                {validationErrors.firstName && <span className="error-message">{validationErrors.firstName}</span>}
                </div>
              </div>
              <div className="edit-popup-input">
                <label htmlFor="email"><span>*</span>Email: </label>
                <div style={{width:'100%'}}>

                  <input type="email" id="email" name="email" value={editedUser.email} onChange={handleEditInputChange} className={validationErrors.email  ? 'error-input' : 'input'} />
                  {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
                </div>

              
              </div>
              <div className="edit-popup-input">
                <label htmlFor="phone"><span>*</span>Phone: </label>
                <div style={{width:'100%'}}>

                <input type="text" id="phone" name="phone" value={editedUser.phone} onChange={handleEditInputChange} className={validationErrors.phone ? 'error-input' : 'input'}/>
                {validationErrors.phone && <span className="error-message">{validationErrors.phone}</span>}
                </div>
              </div>
              <div className="edit-popup-input">
                <label htmlFor="domain"><span>*</span>Website: </label>
                <div style={{width:'100%'}}>

                <input type="text" id="domain" name="domain" value={editedUser.domain} onChange={handleEditInputChange} className={validationErrors.domain  ? 'error-input' : 'input'}/>
                {validationErrors.domain && <span className="error-message">{validationErrors.domain}</span>}
                </div>
              </div>
              <div className="edit-popup-actions">
                <button type="button" onClick={closeEditPopup} className='cancel-btn'>Cancel</button>
                <button type="button" onClick={submitEditedUser} className='submit-btn'>OK</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
