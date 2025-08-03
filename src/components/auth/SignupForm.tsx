'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import '@/styles/loginForm.css'

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          twitterUsername: twitterUsername.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
      });
      
      // Switch to login form after successful signup
      onSwitchToLogin();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <CardHeader>
        <CardTitle className="login-title">Create Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="twitterUsername" className="input-label">
              Twitter Username (optional)
            </label>
            <div className="twitter-input-wrapper">
              <span className="twitter-at">@</span>
              <Input
                id="twitterUsername"
                type="text"
                placeholder="username"
                value={twitterUsername}
                onChange={(e) => setTwitterUsername(e.target.value)}
                className="input-field twitter-input"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;ll track your posts with #0to100xengineer hashtag
            </p>
          </div>

          <Button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="login-footer">
        <p className="footer-text">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="footer-link">
            Login
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;