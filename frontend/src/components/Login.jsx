import { useState } from "react";
import { motion } from "motion/react";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImage from "figma:asset/3377312f0bb7ddd1aa5296a07ac4c8b8453a8ede.png";

export default function Login({ onBack, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    const success = login(email, password);
    if (success) {
      onBack();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#E7E6DD]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <ImageWithFallback
              src={logoImage}
              alt="UniMap Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl mb-2" style={{ color: "#162F65" }}>
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your campus navigation
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
            >
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: "#3361AC" }}
            >
              <LogIn size={18} className="mr-2" />
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={onRegisterClick}
                className="hover:underline"
                style={{ color: "#3361AC" }}
              >
                Register here
              </button>
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <button
              onClick={onBack}
              className="text-sm text-muted-foreground hover:underline"
            >
              Back to Campus
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
