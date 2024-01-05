import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Store/UserSlice'; 

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Dispatch the login action with email and password
    let userCredentials ={
      email,
      password
    };
    dispatch(loginUser(userCredentials));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input type="text" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password:</label>
        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
