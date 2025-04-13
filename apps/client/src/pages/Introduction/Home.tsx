import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Camera, AlertTriangle, Eye, Activity, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary font-medium">
                <Shield className="h-4 w-4 mr-2" />
                Advanced AI-Powered Security
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Real-time Threat Detection for Surveillance Systems
              </h1>
              <p className="text-lg text-muted-foreground">
                ThreatIQ uses advanced AI to analyze CCTV footage and detect potential threats like
                fire, robbery, violence, and suspicious behavior in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" className="px-8">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="bg-card p-1 rounded-lg shadow-xl border border-border">
              <div className="relative aspect-video rounded-md overflow-hidden bg-black">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/assets/images/cctv_threat.png')",
                    filter: "grayscale(0.5) contrast(1.2) brightness(0.8)",
                  }}
                ></div>

                <div className="absolute top-3 left-3 bg-destructive/90 text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Threat Detected
                </div>
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <Camera className="h-3 w-3 mr-1" />
                  LIVE
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-3 w-3 mr-2" />
                    <span>Camera Feed #1 - Reception</span>
                  </div>
                  <div className="text-xs opacity-70">2024-07-24 13:45:22</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered system continuously monitors your surveillance feeds to ensure maximum
              security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-6 border border-border/60 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-primary/10 inline-flex rounded-lg mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ThreatIQ seamlessly integrates with your existing surveillance infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="bg-card rounded-xl p-8 md:p-12 border border-border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Ready to secure your premises?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Get started with ThreatIQ today and experience the peace of mind that comes with
                  real-time threat detection.
                </p>
                <Button size="lg">Contact Sales</Button>
              </div>
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                        <ChevronRight className="h-3 w-3 text-primary" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  {
    title: "Fire Detection",
    description:
      "Instantly detect smoke or fire in any camera feed and trigger alerts to prevent disasters before they spread.",
    icon: <AlertTriangle className="h-5 w-5 text-primary" />,
  },
  {
    title: "Robbery & Intrusion",
    description:
      "Identify suspicious behavior, unauthorized access, and potential robbery situations in real-time.",
    icon: <Shield className="h-5 w-5 text-primary" />,
  },
  {
    title: "24/7 Monitoring",
    description:
      "Continuous analysis of all camera feeds with intelligent alerts sent directly to your security team.",
    icon: <Eye className="h-5 w-5 text-primary" />,
  },
];

const steps = [
  {
    title: "Connect Your Cameras",
    description:
      "Easily integrate ThreatIQ with your existing CCTV infrastructure without replacing hardware.",
  },
  {
    title: "AI Analysis",
    description:
      "Our advanced algorithms continuously scan footage to detect potential security threats.",
  },
  {
    title: "Instant Alerts",
    description:
      "Receive real-time notifications when suspicious activities are detected, allowing for immediate response.",
  },
];

const benefits = [
  "Reduce security personnel costs by up to 40%",
  "Prevent false alarms with 99.5% accuracy",
  "Easy integration with existing systems",
  "Customizable alert thresholds and detection parameters",
  "Comprehensive reporting and analytics dashboard",
];
