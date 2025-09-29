import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, FileText, Bell, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardField = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Readings", value: "127", icon: FileText, color: "text-primary" },
    { label: "This Month", value: "23", icon: Camera, color: "text-secondary" },
    { label: "Verified", value: "119", icon: Award, color: "text-success" },
    { label: "Pending", value: "8", icon: Bell, color: "text-warning" },
  ];

  const recentSubmissions = [
    { id: 1, site: "Site A-101", level: "2.4m", date: "Today, 9:30 AM", status: "verified" },
    { id: 2, site: "Site A-102", level: "1.8m", date: "Today, 6:15 AM", status: "pending" },
    { id: 3, site: "Site A-101", level: "2.2m", date: "Yesterday, 9:30 AM", status: "verified" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, Guardian!</h1>
              <p className="text-blue-100">Field Personnel Dashboard</p>
            </div>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer border-2 border-primary/20 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Record New Reading</CardTitle>
                  <CardDescription>Capture water level with photo verification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-primary to-primary-light text-lg py-6">
                Start Recording
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">My Submissions</CardTitle>
                  <CardDescription>View timeline and verification status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full text-lg py-6">
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your latest water level readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{submission.site}</p>
                      <p className="text-sm text-muted-foreground">{submission.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-primary">{submission.level}</p>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        submission.status === "verified"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {submission.status === "verified" ? "Verified" : "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encouragement Message */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Award className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-lg text-foreground">You are a Water Guardian!</p>
                <p className="text-muted-foreground">
                  Thank you for contributing to flood safety. Your vigilance protects communities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardField;
