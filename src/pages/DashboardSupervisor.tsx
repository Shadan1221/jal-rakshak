import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, LogOut, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Reading {
  id: string;
  site_id: string;
  user_name: string;
  water_level: number;
  photo_url: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  status: string;
  sites: {
    name: string;
  };
}

const DashboardSupervisor = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [readings, setReadings] = useState<Reading[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadReadings();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('readings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'readings'
        },
        () => {
          loadReadings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadReadings = async () => {
    const { data, error } = await supabase
      .from("readings")
      .select(`
        *,
        sites (name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
      return;
    }

    setReadings(data || []);

    // Calculate stats
    setStats({
      total: data?.length || 0,
      pending: data?.filter((r) => r.status === "pending").length || 0,
      verified: data?.filter((r) => r.status === "verified").length || 0,
      rejected: data?.filter((r) => r.status === "rejected").length || 0,
    });
  };

  const handleVerify = async (id: string) => {
    const { error } = await supabase
      .from("readings")
      .update({ status: "verified" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to verify submission",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Verified",
      description: "Submission has been verified successfully",
    });

    loadReadings();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("readings")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject submission",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rejected",
      description: "Submission has been rejected",
      variant: "destructive",
    });

    loadReadings();
  };

  const handleLogout = () => {
    navigate("/");
  };

  const filteredReadings = readings.filter((r) => {
    if (activeTab === "all") return true;
    return r.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-secondary border-b border-border/40 backdrop-blur-sm shadow-md">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Supervisor</h1>
              <p className="text-sm text-white/80">Verify Field Submissions</p>
            </div>
            <div className="flex gap-2">
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
              <CardDescription className="text-xs font-medium text-foreground/60 mb-1">Total Submissions</CardDescription>
              <CardTitle className="text-3xl font-bold text-foreground">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardDescription className="text-xs font-medium text-foreground/60 mb-1">Pending Review</CardDescription>
              <CardTitle className="text-3xl font-bold text-warning">{stats.pending}</CardTitle>
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
              <CardDescription className="text-xs font-medium text-foreground/60 mb-1">Rejected</CardDescription>
              <CardTitle className="text-3xl font-bold text-destructive">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending
              {stats.pending > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {stats.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified" className="text-xs">Verified</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Submissions List */}
        <div className="space-y-3">
          {filteredReadings.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <p className="text-foreground font-medium mb-1">No submissions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredReadings.map((reading) => (
              <Card key={reading.id} className="overflow-hidden bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{reading.sites.name}</p>
                        <p className="text-sm text-foreground/60">
                          By {reading.user_name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          reading.status === "verified"
                            ? "default"
                            : reading.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {reading.status === "verified" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {reading.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {reading.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {reading.status}
                      </Badge>
                    </div>

                    {/* Photo */}
                    <img
                      src={reading.photo_url}
                      alt="Gauge reading"
                      className="w-full h-48 object-cover rounded-lg border"
                    />

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-foreground/60 text-xs">Water Level</p>
                        <p className="font-bold text-lg text-primary">{reading.water_level}m</p>
                      </div>
                      <div>
                        <p className="text-foreground/60 text-xs">Timestamp</p>
                        <p className="font-medium text-foreground">
                          {new Date(reading.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-foreground/60">
                      <MapPin className="h-3 w-3" />
                      <span>{reading.latitude.toFixed(6)}, {reading.longitude.toFixed(6)}</span>
                    </div>

                    {/* Actions */}
                    {reading.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => handleReject(reading.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          className="flex-1 bg-success hover:bg-success/90"
                          onClick={() => handleVerify(reading.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSupervisor;
