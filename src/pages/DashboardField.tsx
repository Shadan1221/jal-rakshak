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
          <Card className="bg-card/50 backdrop-blur-sm" style={{ backgroundImage: 'var(--pattern-indian)' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Readings</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm" style={{ backgroundImage: 'var(--pattern-indian)' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">This Month</CardDescription>
              <CardTitle className="text-2xl">{stats.thisMonth}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm" style={{ backgroundImage: 'var(--pattern-indian)' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Verified</CardDescription>
              <CardTitle className="text-2xl text-success">{stats.verified}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm" style={{ backgroundImage: 'var(--pattern-indian)' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Pending</CardDescription>
              <CardTitle className="text-2xl text-warning">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="space-y-3 mb-6">
          <Card 
            className="bg-gradient-to-br from-primary to-primary/80 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setRecordDialogOpen(true)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-white">Record New Reading</CardTitle>
                  <CardDescription className="text-white/80">
                    Capture gauge post & submit data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Submissions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">My Submissions</h2>
          </div>

          <div className="space-y-3">
            {readings.length === 0 ? (
              <Card style={{ backgroundImage: 'var(--pattern-indian)' }}>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No submissions yet</p>
                  <p className="text-sm">Tap "Record New Reading" to get started</p>
                </CardContent>
              </Card>
            ) : (
              readings.map((reading) => (
                <Card key={reading.id} className="overflow-hidden" style={{ backgroundImage: 'var(--pattern-indian)' }}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={reading.photo_url}
                        alt="Gauge reading"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-sm truncate">
                            {reading.sites.name}
                          </p>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(reading.status)}
                            <span className="text-xs">{getStatusText(reading.status)}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-primary mb-1">
                          {reading.water_level}m
                        </p>
                        <p className="text-xs text-muted-foreground">
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
