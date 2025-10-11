import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Shield, MapPin, Camera, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-water-monitoring.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Geofencing Validation",
      description: "Ensures readings are captured at designated monitoring sites",
    },
    {
      icon: Camera,
      title: "Live Photo Verification",
      description: "Real-time image capture with timestamp for authenticity",
    },
    {
      icon: Shield,
      title: "Multi-level Verification",
      description: "Field personnel, supervisor, and central analyst workflow",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track water levels and identify flood risks instantly",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary-dark/90 to-primary/95" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Droplet className="h-20 w-20 text-white" fill="currentColor" />
              <div className="absolute -bottom-1 -right-1 bg-success p-2 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Neer Nirakshan
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-2xl mx-auto">
            Guardian of Water
          </p>
          <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Smart Water Monitoring for a Safer India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="bg-white text-primary hover:bg-blue-50 text-lg px-8 py-6 shadow-elevated"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Neer Nirakshan empowers field personnel, supervisors, and analysts with a unified platform
              to monitor water levels across India. Through geofencing, live photo verification, and
              multi-level authentication, we ensure accurate, tamper-proof data collection for flood
              prevention and water resource management.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Who We Serve</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Role-based access for efficient water monitoring at every level
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-card text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">Field Personnel</CardTitle>
                <CardDescription className="text-base">
                  Capture water levels with geofencing validation and live photo verification
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Shield className="h-16 w-16 text-secondary" />
                </div>
                <CardTitle className="text-2xl mb-2">Supervisors</CardTitle>
                <CardDescription className="text-base">
                  Monitor submissions, verify readings, and ensure data accuracy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <TrendingUp className="h-16 w-16 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-2">Central Analysts</CardTitle>
                <CardDescription className="text-base">
                  Analyze trends, manage users, and generate comprehensive reports
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of water guardians protecting communities across India
          </p>
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-white text-primary hover:bg-blue-50 text-lg px-8 py-6"
          >
            Start Monitoring Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Droplet className="h-8 w-8 mr-2" fill="currentColor" />
            <span className="text-xl font-bold">Neer Nirakshan</span>
          </div>
          <p className="text-blue-200">Smart Water Monitoring for a Safer India</p>
          <p className="text-blue-300 text-sm mt-4">© 2024 Neer Nirakshan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
