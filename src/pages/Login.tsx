import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, ArrowLeft, Eye, EyeOff, Copy, Check, Users, Shield, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Role = "field" | "supervisor" | "analyst";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string>("");

  const roleConfig = {
    field: {
      name: "Field Personnel",
      description: "Record water level readings",
      icon: Users,
      borderColor: "border-l-primary",
      bgColor: "bg-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    supervisor: {
      name: "Supervisor",
      description: "Verify and monitor submissions",
      icon: Shield,
      borderColor: "border-l-secondary",
      bgColor: "bg-secondary/5",
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    analyst: {
      name: "Central Analyst",
      description: "Analyze and manage system",
      icon: BarChart3,
      borderColor: "border-l-accent",
      bgColor: "bg-accent/5",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
  };

  // Demo credentials for testing
  const demoCredentials = {
    field: { username: "field_demo", password: "field123" },
    supervisor: { username: "supervisor_demo", password: "super123" },
    analyst: { username: "analyst_demo", password: "admin123" }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleLogin = () => {
    if (!selectedRole) return;

    const credentials = demoCredentials[selectedRole];
    
    if (username === credentials.username && password === credentials.password) {
      toast({
        title: "Login Successful",
        description: `Welcome, ${roleConfig[selectedRole].name}!`,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                  <Droplet className="h-10 w-10 text-white" fill="currentColor" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Neer Nirakshan</h1>
            <p className="text-muted-foreground text-base">Smart Water Monitoring System</p>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-1">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">Select your role to continue</p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-3">
            {(["field", "supervisor", "analyst"] as Role[]).map((role) => {
              const config = roleConfig[role];
              const Icon = config.icon;
              
              return (
                <Card
                  key={role}
                  className={`cursor-pointer transition-all active:scale-[0.98] hover:shadow-lg border-l-4 ${config.borderColor} ${config.bgColor}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`${config.iconBg} p-3 rounded-xl flex-shrink-0`}>
                        <Icon className={`h-6 w-6 ${config.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-base mb-0.5">
                          {config.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              Empowering water guardians across India
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
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
            <div className={`${roleConfig[selectedRole].iconBg} p-2 rounded-lg`}>
              {(() => {
                const Icon = roleConfig[selectedRole].icon;
                return <Icon className={`h-6 w-6 ${roleConfig[selectedRole].iconColor}`} />;
              })()}
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">Login</CardTitle>
              <CardDescription className="text-sm">{roleConfig[selectedRole].name}</CardDescription>
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
            className="w-full bg-gradient-to-r from-primary to-secondary text-base py-6 hover:opacity-90"
            disabled={!username || !password}
          >
            Login
          </Button>

          <div className="bg-muted/50 rounded-lg p-4 text-sm border">
            <p className="font-semibold text-foreground mb-3">Demo Credentials:</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="font-mono text-foreground font-semibold">{demoCredentials[selectedRole].username}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(demoCredentials[selectedRole].username, "Username")}
                >
                  {copiedField === "Username" ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Password</p>
                  <p className="font-mono text-foreground font-semibold">{demoCredentials[selectedRole].password}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(demoCredentials[selectedRole].password, "Password")}
                >
                  {copiedField === "Password" ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
