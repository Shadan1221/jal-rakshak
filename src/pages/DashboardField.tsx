import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, FileText, Bell, Award, Menu } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white sticky top-0 z-10 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              <h1 className="text-lg font-bold">Jal Rakshak</h1>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate("/")}
              className="text-xs"
            >
              Logout
            </Button>
          </div>
          <div>
            <p className="text-sm text-blue-100">Welcome, Guardian!</p>
            <p className="text-xs text-blue-200">Field Personnel</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="pt-4 pb-3 px-3">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Actions - Mobile Optimized */}
        <div className="space-y-3 mb-6">
          <Card className="shadow-card active:shadow-elevated transition-shadow border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base">Record New Reading</CardTitle>
                  <CardDescription className="text-xs">Capture water level with photo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full bg-gradient-to-r from-primary to-primary-light py-6">
                <Camera className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card active:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base">My Submissions</CardTitle>
                  <CardDescription className="text-xs">View timeline and status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full py-6">
                <FileText className="h-5 w-5 mr-2" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions - Mobile Optimized */}
        <Card className="shadow-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Submissions</CardTitle>
            <CardDescription className="text-xs">Your latest water level readings</CardDescription>
          </CardHeader>
          <CardContent className="px-3">
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 active:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{submission.site}</p>
                      <p className="text-xs text-muted-foreground">{submission.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-base font-bold text-primary">{submission.level}</p>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        submission.status === "verified"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {submission.status === "verified" ? "✓" : "⏳"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encouragement Message - Mobile Optimized */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-start gap-3">
              <Award className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-foreground mb-1">You are a Water Guardian!</p>
                <p className="text-xs text-muted-foreground">
                  Thank you for contributing to flood safety. Your vigilance protects communities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-elevated z-10">
        <div className="grid grid-cols-3 gap-2 p-3">
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <Camera className="h-5 w-5" />
            <span className="text-xs">Record</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <FileText className="h-5 w-5" />
            <span className="text-xs">History</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <Bell className="h-5 w-5" />
            <span className="text-xs">Alerts</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardField;
