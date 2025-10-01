import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Camera, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Site {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface RecordReadingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RecordReading = ({ open, onOpenChange, onSuccess }: RecordReadingProps) => {
  const [step, setStep] = useState<"location" | "photo" | "reading">("location");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestSite, setNearestSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [waterLevel, setWaterLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadSites();
      getUserLocation();
    } else {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setStep("location");
    setUserLocation(null);
    setNearestSite(null);
    setIsWithinGeofence(false);
    setPhoto(null);
    setPhotoPreview("");
    setWaterLevel("");
  };

  const loadSites = async () => {
    const { data, error } = await supabase
      .from("sites")
      .select("*");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load monitoring sites",
        variant: "destructive",
      });
      return;
    }

    setSites(data || []);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        checkGeofence(location);
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please enable location services.",
          variant: "destructive",
        });
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const checkGeofence = (location: { lat: number; lng: number }) => {
    let nearest: Site | null = null;
    let minDistance = Infinity;

    sites.forEach((site) => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        Number(site.latitude),
        Number(site.longitude)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = site;
      }
    });

    if (nearest) {
      setNearestSite(nearest);
      const withinFence = minDistance <= nearest.radius;
      setIsWithinGeofence(withinFence);

      if (withinFence) {
        toast({
          title: "Location Verified",
          description: `You are at ${nearest.name}`,
        });
      } else {
        toast({
          title: "Outside Geofence",
          description: `You are ${Math.round(minDistance)}m away from ${nearest.name}. Please move closer (within ${nearest.radius}m).`,
          variant: "destructive",
        });
      }
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!photo || !waterLevel || !userLocation || !nearestSite) return;

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit readings",
          variant: "destructive",
        });
        return;
      }

      // Upload photo to storage
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("gauge-photos")
        .upload(fileName, photo);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("gauge-photos")
        .getPublicUrl(fileName);

      // Insert reading
      const { error: insertError } = await supabase
        .from("readings")
        .insert({
          site_id: nearestSite.id,
          user_id: user.id,
          user_name: user.email?.split('@')[0] || 'Field Personnel',
          water_level: parseFloat(waterLevel),
          photo_url: publicUrl,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          status: 'pending',
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Reading submitted successfully. Thank you for contributing to flood safety.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit reading",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record New Reading</DialogTitle>
        </DialogHeader>

        {/* Location Verification Step */}
        {step === "location" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Verification
                </CardTitle>
                <CardDescription>
                  Verifying your location against monitoring sites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userLocation && nearestSite ? (
                  <>
                    <div className="h-64 rounded-lg overflow-hidden border">
                      <MapContainer
                        key={`${userLocation.lat}-${userLocation.lng}`}
                        center={[userLocation.lat, userLocation.lng]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[userLocation.lat, userLocation.lng]}>
                          <Popup>Your Location</Popup>
                        </Marker>
                        <Marker position={[Number(nearestSite.latitude), Number(nearestSite.longitude)]}>
                          <Popup>{nearestSite.name}</Popup>
                        </Marker>
                        <Circle
                          center={[Number(nearestSite.latitude), Number(nearestSite.longitude)]}
                          radius={Number(nearestSite.radius)}
                          pathOptions={{ color: isWithinGeofence ? 'green' : 'red', fillOpacity: 0.2 }}
                        />
                      </MapContainer>
                    </div>

                    <div className={`p-4 rounded-lg flex items-start gap-3 ${
                      isWithinGeofence ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
                    }`}>
                      {isWithinGeofence ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <p className="font-medium text-success">Location Verified</p>
                            <p className="text-sm text-muted-foreground">
                              You are within the monitoring zone of {nearestSite.name}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                          <div>
                            <p className="font-medium text-destructive">Outside Monitoring Zone</p>
                            <p className="text-sm text-muted-foreground">
                              Please move closer to {nearestSite.name} to continue
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      disabled={!isWithinGeofence}
                      onClick={() => setStep("photo")}
                    >
                      Continue to Photo Capture
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Getting your location...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Photo Capture Step */}
        {step === "photo" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Capture Gauge Post Photo
                </CardTitle>
                <CardDescription>
                  Take a clear photo of the water level gauge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={photoPreview}
                      alt="Captured gauge"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Retake Photo
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => setStep("reading")}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full h-32"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="h-8 w-8" />
                      <span>Tap to Capture Photo</span>
                    </div>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reading Entry Step */}
        {step === "reading" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Enter Water Level
                </CardTitle>
                <CardDescription>
                  Record the gauge reading from the photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Captured gauge"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                )}

                <div className="space-y-2">
                  <Label htmlFor="waterLevel">Water Level (meters)</Label>
                  <Input
                    id="waterLevel"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2.45"
                    value={waterLevel}
                    onChange={(e) => setWaterLevel(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                  <p><strong>Site:</strong> {nearestSite?.name}</p>
                  <p><strong>Location:</strong> {userLocation?.lat.toFixed(6)}, {userLocation?.lng.toFixed(6)}</p>
                  <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("photo")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={!waterLevel || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Reading"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecordReading;
