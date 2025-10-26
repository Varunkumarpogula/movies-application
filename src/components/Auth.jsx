import { SignIn, SignUp } from "@clerk/clerk-react";

export function SignInPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f5f5f5'
    }}>
      <SignIn />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f5f5f5'
    }}>
      <SignUp />
    </div>
  );
}