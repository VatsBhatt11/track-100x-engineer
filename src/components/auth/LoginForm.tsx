// components/auth/LoginForm.tsx
'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import '@/styles/loginForm.css'

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // ✅ Simulate login + store dummy user
      const user = {
        id: "user-1",
        name: "Demo User",
        email,
      };
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "Logged in successfully",
        description: "Welcome to Track100xEngineers!",
      });

      // ✅ Redirect to home
      window.location.href = "/";
    }, 1000);
  };

  return(
    <Card className="login-card">
      <CardHeader>
        <CardTitle className="login-title">Login to Track100x</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="login-form">
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

          <Button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="login-footer">
        <p className="footer-text">
          Don&apos;t have an account?
          <a href="/register" className="footer-link">Register</a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
