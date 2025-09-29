import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Role = "field" | "supervisor" | "analyst";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roleNames = {
    field: "Field Personnel",
    supervisor: "Supervisor",
    analyst: "Central Analyst"
  };

  // Demo credentials for testing
  const demoCredentials = {
    field: { username: "field_demo", password: "field123" },
    supervisor: { username: "supervisor_demo", password: "super123" },
    analyst: { username: "analyst_demo", password: "admin123" }
  };

  const handleLogin = () => {
    if (!selectedRole) return;

    const credentials = demoCredentials[selectedRole];
    
    if (username === credentials.username && password === credentials.password) {
      toast({
        title: "Login Successful",
        description: `Welcome, ${roleNames[selectedRole]}!`,
      });
      navigate(`/dashboard/${selectedRole}`);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-secondary p-4">
        <div className="w-full max-w-md sm:max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Waves className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Jal Rakshak</h1>
            <p className="text-blue-100 text-base sm:text-lg">Select Your Role to Continue</p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            {(["field", "supervisor", "analyst"] as Role[]).map((role) => (
              <Card
                key={role}
                className="cursor-pointer transition-all active:scale-95 sm:hover:scale-105 sm:hover:shadow-xl bg-white/95 backdrop-blur border-0"
                onClick={() => setSelectedRole(role)}
              >
                <CardHeader className="text-center p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl text-primary">{roleNames[role]}</CardTitle>
                  <CardDescription className="text-sm">
                    {role === "field" && "Record water level readings"}
                    {role === "supervisor" && "Verify and monitor submissions"}
                    {role === "analyst" && "Analyze and manage system"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-4 pt-0">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-light">
                    Login
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-secondary p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur border-0 shadow-2xl">
        <CardHeader>
          <Button
            variant="ghost"
            className="w-fit mb-4 -ml-2"
            onClick={() => {
              setSelectedRole(null);
              setUsername("");
              setPassword("");
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Waves className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-xl sm:text-2xl text-primary">Login</CardTitle>
              <CardDescription className="text-sm sm:text-base">{roleNames[selectedRole]}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-base"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-base pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-primary to-primary-light text-base sm:text-lg py-5 sm:py-6"
            disabled={!username || !password}
          >
            Login
          </Button>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-semibold text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Username: <span className="font-mono text-foreground">{demoCredentials[selectedRole].username}</span></p>
              <p>Password: <span className="font-mono text-foreground">{demoCredentials[selectedRole].password}</span></p>
            </div>
          </div>

          <div className="text-center text-xs sm:text-sm text-muted-foreground pt-4 border-t">
            <p>Smart Water Monitoring for a Safer India</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
