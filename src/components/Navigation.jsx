import { Link } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">🎬 MovieApp</Link>
      </div>
      
      <SignedIn>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/recent">Recent</Link>
        </div>
        <UserProfile />
      </SignedIn>

      <SignedOut>
        <div className="nav-auth">
          <Link to="/sign-in" className="auth-link">Sign In</Link>
          <Link to="/sign-up" className="auth-link sign-up">Sign Up</Link>
        </div>
      </SignedOut>
    </nav>
  );
}