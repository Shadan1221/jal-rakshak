import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, FileText, Clock, CheckCircle2, XCircle, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RecordReading from "@/components/RecordReading";

interface Reading {
  id: string;
  site_id: string;
  water_level: number;
  photo_url: string;
  timestamp: string;
  status: string;
  sites: {
    name: string;
  };
}

const DashboardField = () => {
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    verified: 0,
    pending: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("readings")
      .select(`
        *,
        sites (name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load readings",
        variant: "destructive",
      });
      return;
    }

    setReadings(data || []);

    // Calculate stats
    const now = new Date();
    const thisMonth = data?.filter((r) => {
      const readingDate = new Date(r.created_at);
      return readingDate.getMonth() === now.getMonth() && 
             readingDate.getFullYear() === now.getFullYear();
    }).length || 0;

    setStats({
      total: data?.length || 0,
      thisMonth,
      verified: data?.filter((r) => r.status === "verified").length || 0,
      pending: data?.filter((r) => r.status === "pending").length || 0,
    });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-water border-b border-border/40 backdrop-blur-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Field Personnel</h1>
              <p className="text-sm text-white/80">Water Guardian Dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate("/")}
              >
                <Home className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardDescription className="text-xs font-medium text-foreground/60 mb-1">Total Readings</CardDescription>
              <CardTitle className="text-3xl font-bold text-foreground">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardDescription className="text-xs font-medium text-foreground/60 mb-1">This Month</CardDescription>
              <CardTitle className="text-3xl font-bold text-foreground">{stats.thisMonth}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardDescription className="text-xs font-medium text-foreground/60 mb-1">Verified</CardDescription>
              <CardTitle className="text-3xl font-bold text-success">{stats.verified}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardDescription className="text-xs font-medium text-foreground/60 mb-1">Pending</CardDescription>
              <CardTitle className="text-3xl font-bold text-warning">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="space-y-3 mb-6">
          <Card 
            className="bg-gradient-to-br from-primary to-primary/80 text-white cursor-pointer hover:shadow-xl transition-all active:scale-[0.98] border-0"
            onClick={() => setRecordDialogOpen(true)}
          >
            <CardHeader className="p-5">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Camera className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg mb-1">Record New Reading</CardTitle>
                  <CardDescription className="text-white/90 text-sm">
                    Capture gauge post & submit data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Submissions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">My Submissions</h2>
          </div>

          <div className="space-y-3">
            {readings.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-foreground font-medium mb-1">No submissions yet</p>
                  <p className="text-sm text-foreground/60">Tap "Record New Reading" to get started</p>
                </CardContent>
              </Card>
            ) : (
              readings.map((reading) => (
                <Card key={reading.id} className="overflow-hidden bg-card border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={reading.photo_url}
                        alt="Gauge reading"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-sm text-foreground truncate pr-2">
                            {reading.sites.name}
                          </p>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {getStatusIcon(reading.status)}
                            <span className="text-xs font-medium text-foreground/80">{getStatusText(reading.status)}</span>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-primary mb-2">
                          {reading.water_level}m
                        </p>
                        <p className="text-xs text-foreground/60 font-medium">
                          {new Date(reading.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Record Reading Dialog */}
      <RecordReading
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        onSuccess={loadReadings}
      />
    </div>
  );
};

export default DashboardField;
