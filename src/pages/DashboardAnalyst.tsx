import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Waves,
  MapPin,
  TrendingUp,
  Users,
  AlertTriangle,
  Activity,
  Database,
  Settings,
  FileText,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardAnalyst = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Active Sites", value: "156", change: "+12", icon: MapPin, color: "text-primary" },
    { label: "Field Personnel", value: "89", change: "+5", icon: Users, color: "text-secondary" },
    { label: "Today's Readings", value: "342", change: "+28", icon: Activity, color: "text-success" },
    { label: "Critical Alerts", value: "7", change: "-2", icon: AlertTriangle, color: "text-warning" },
  ];

  const siteData = [
    { state: "Maharashtra", sites: 45, readings: 1203, alerts: 2, status: "normal" },
    { state: "Gujarat", sites: 38, readings: 987, alerts: 1, status: "normal" },
    { state: "Uttar Pradesh", sites: 52, readings: 1456, alerts: 3, status: "caution" },
    { state: "Bihar", sites: 21, readings: 567, alerts: 1, status: "normal" },
  ];

  const recentActivity = [
    { type: "reading", user: "Rahul Kumar", site: "Site A-101", level: "2.4m", time: "5 mins ago" },
    { type: "verified", user: "Supervisor Priya", site: "Site B-205", level: "1.8m", time: "12 mins ago" },
    { type: "alert", user: "System", site: "Site C-310", level: "3.5m", time: "18 mins ago" },
    { type: "reading", user: "Amit Patel", site: "Site D-412", level: "2.1m", time: "25 mins ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-success/10 text-success";
      case "caution": return "bg-warning/10 text-warning";
      case "critical": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Waves className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Neer Nirakshan Analytics</h1>
                <p className="text-sm text-blue-100">Central Analyst Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-white">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
              <Button variant="secondary" onClick={() => navigate("/")}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {stat.change} from yesterday
                    </p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sites">
              <MapPin className="h-4 w-4 mr-2" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="personnel">
              <Users className="h-4 w-4 mr-2" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* State-wise Data */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    State-wise Monitoring
                  </CardTitle>
                  <CardDescription>Real-time water level monitoring across India</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {siteData.map((state) => (
                      <div key={state.state} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{state.state}</p>
                            <Badge className={getStatusColor(state.status)}>
                              {state.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Sites</p>
                              <p className="font-bold text-primary">{state.sites}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Readings</p>
                              <p className="font-bold">{state.readings}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Alerts</p>
                              <p className="font-bold text-warning">{state.alerts}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Live updates from the field</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'alert' ? 'bg-warning/10' :
                          activity.type === 'verified' ? 'bg-success/10' :
                          'bg-primary/10'
                        }`}>
                          {activity.type === 'alert' && <AlertTriangle className="h-4 w-4 text-warning" />}
                          {activity.type === 'verified' && <TrendingUp className="h-4 w-4 text-success" />}
                          {activity.type === 'reading' && <Activity className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.site} • {activity.level}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Water Level Trends Chart Placeholder */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Water Level Trends
                </CardTitle>
                <CardDescription>Historical data and predictive analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Chart visualization placeholder</p>
                    <p className="text-sm text-muted-foreground">Real-time data integration available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sites">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Site Management</CardTitle>
                <CardDescription>Manage and monitor all water level monitoring sites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Site management interface - Coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personnel">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Personnel Management</CardTitle>
                <CardDescription>Manage field personnel and supervisors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Personnel management interface - Coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Generate and export comprehensive reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Reports generation interface - Coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardAnalyst;
