import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...userDocSnap.data(),
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (name, email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Update profile with display name
      await firebaseUpdateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        createdAt: new Date().toISOString(),
        role: 'user',
      });

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        role: 'user',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { user: userData };
    } catch (err) {
      const message = err.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : err.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : err.message || 'Signup failed';
      setError(message);
      throw err;
    }
  };

  const signin = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Get user data from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        ...userDocSnap.data(),
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { user: userData };
    } catch (err) {
      const message = err.code === 'auth/user-not-found'
        ? 'User not found'
        : err.code === 'auth/wrong-password'
        ? 'Wrong password'
        : err.message || 'Signin failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      const message = err.message || 'Logout failed';
      setError(message);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('No user logged in');

      // Update Firebase profile if displayName is provided
      if (profileData.displayName) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL || firebaseUser.photoURL,
        });
      }

      // Update Firestore user document
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, profileData, { merge: true });

      // Update local state
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    } catch (err) {
      const message = err.message || 'Profile update failed';
      setError(message);
      throw err;
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isLoggedIn = () => !!user;

  const value = {
    user,
    loading,
    error,
    signup,
    signin,
    logout,
    updateProfile,
    isAdmin,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
