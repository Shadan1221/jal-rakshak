import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, XCircle, Clock, User, Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardSupervisor = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");

  const stats = [
    { label: "Total Sites", value: "24", icon: MapPin, color: "text-primary" },
    { label: "Pending", value: "8", icon: Clock, color: "text-warning" },
    { label: "Verified", value: "142", icon: CheckCircle, color: "text-success" },
    { label: "Rejected", value: "3", icon: XCircle, color: "text-destructive" },
  ];

  const submissions = [
    {
      id: 1,
      site: "Site A-101",
      personnel: "Rahul Kumar",
      level: "2.4m",
      date: "Today, 9:30 AM",
      status: "pending",
      location: { lat: 28.6139, lng: 77.2090 },
      photoUrl: "📷"
    },
    {
      id: 2,
      site: "Site A-102",
      personnel: "Priya Sharma",
      level: "1.8m",
      date: "Today, 8:15 AM",
      status: "pending",
      location: { lat: 28.6200, lng: 77.2100 },
      photoUrl: "📷"
    },
    {
      id: 3,
      site: "Site B-205",
      personnel: "Amit Patel",
      level: "3.1m",
      date: "Today, 6:45 AM",
      status: "verified",
      location: { lat: 28.6050, lng: 77.1950 },
      photoUrl: "📷"
    },
    {
      id: 4,
      site: "Site C-310",
      personnel: "Sunita Singh",
      level: "2.2m",
      date: "Yesterday, 5:30 PM",
      status: "verified",
      location: { lat: 28.6300, lng: 77.2200 },
      photoUrl: "📷"
    },
  ];

  const filteredSubmissions = filter === "all" 
    ? submissions 
    : submissions.filter(s => s.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning/10 text-warning";
      case "verified": return "bg-success/10 text-success";
      case "rejected": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleVerify = (id: number) => {
    console.log("Verified submission:", id);
  };

  const handleReject = (id: number) => {
    console.log("Rejected submission:", id);
  };

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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate("/")}
                className="text-xs"
              >
                Logout
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-blue-100">Supervisor Dashboard</p>
            <p className="text-xs text-blue-200">Verify & Monitor Submissions</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Stats Grid */}
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

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(["all", "pending", "verified", "rejected"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize whitespace-nowrap"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <CardTitle className="text-sm">{submission.site}</CardTitle>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {submission.personnel}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Water Level:</span>
                    <span className="font-bold text-primary text-lg">{submission.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{submission.date}</span>
                    <span className="flex items-center gap-1">
                      {submission.photoUrl} Photo
                    </span>
                  </div>

                  {submission.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-success hover:bg-success/90"
                        onClick={() => handleVerify(submission.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(submission.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No {filter} submissions found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-elevated z-10">
        <div className="grid grid-cols-3 gap-2 p-3">
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <Clock className="h-5 w-5" />
            <span className="text-xs">Pending</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <MapPin className="h-5 w-5" />
            <span className="text-xs">Sites Map</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <User className="h-5 w-5" />
            <span className="text-xs">Personnel</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSupervisor;
