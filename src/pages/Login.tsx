import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, ArrowLeft } from "lucide-react";

type Role = "field" | "supervisor" | "analyst";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const roleNames = {
    field: "Field Personnel",
    supervisor: "Supervisor",
    analyst: "Central Analyst"
  };

  const handleSendOTP = () => {
    if (phoneNumber.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      navigate(`/dashboard/${selectedRole}`);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-secondary p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Waves className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Jal Rakshak</h1>
            <p className="text-blue-100 text-lg">Select Your Role to Continue</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(["field", "supervisor", "analyst"] as Role[]).map((role) => (
              <Card
                key={role}
                className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-white/95 backdrop-blur border-0"
                onClick={() => setSelectedRole(role)}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-primary">{roleNames[role]}</CardTitle>
                  <CardDescription>
                    {role === "field" && "Record water level readings"}
                    {role === "supervisor" && "Verify and monitor submissions"}
                    {role === "analyst" && "Analyze and manage system"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-light">
                    Login as {roleNames[role]}
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
            className="w-fit mb-4"
            onClick={() => {
              setSelectedRole(null);
              setOtpSent(false);
              setPhoneNumber("");
              setOtp("");
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Waves className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl text-primary">Login</CardTitle>
              <CardDescription className="text-base">{roleNames[selectedRole]}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              disabled={otpSent}
              className="text-lg"
            />
          </div>

          {!otpSent ? (
            <Button
              onClick={handleSendOTP}
              className="w-full bg-gradient-to-r from-primary to-primary-light text-lg py-6"
              disabled={phoneNumber.length !== 10}
            >
              Send OTP
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-lg text-center tracking-widest"
                />
                <p className="text-sm text-muted-foreground text-center">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-primary to-primary-light text-lg py-6"
                disabled={otp.length !== 6}
              >
                Verify & Login
              </Button>

              <Button
                variant="outline"
                onClick={() => setOtpSent(false)}
                className="w-full"
              >
                Resend OTP
              </Button>
            </>
          )}

          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>Smart Water Monitoring for a Safer India</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
