import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin', 'seller', 'customer'
  const [loading, setLoading] = useState(true);

  // Version counter to prevent onAuthStateChanged from overwriting
  // a role that was already set by Login/Register components.
  // When setUserRole is called manually, the version increments so any
  // in-flight Firestore read from onAuthStateChanged is discarded.
  const roleVersionRef = useRef(0);

  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function updateUserRole(role) {
    roleVersionRef.current++;
    setUserRole(role);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const versionAtStart = roleVersionRef.current;
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          // Only update role if no manual override happened during the fetch
          if (roleVersionRef.current === versionAtStart) {
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role);
            } else {
              setUserRole('customer');
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          if (roleVersionRef.current === versionAtStart) {
            setUserRole('customer');
          }
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    setUserRole: updateUserRole,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={{ ...value, loading }}>
      {loading ? (
        <div className="h-screen w-full flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
