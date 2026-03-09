import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Bell, Palette, Shield, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings, useUpdateSettings } from "@/hooks/useApi";

const Settings = () => {
  const { toast } = useToast();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  // Helper to get a setting value by key from grouped response
  const getVal = (key: string, fallback = "") => {
    if (!settings) return fallback;
    for (const group of Object.values(settings)) {
      if (key in group) return group[key];
    }
    return fallback;
  };

  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [emailNotif, setEmailNotif] = useState(true);
  const [donationNotif, setDonationNotif] = useState(true);
  const [newSubNotif, setNewSubNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [compactSidebar, setCompactSidebar] = useState(false);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);

  // Seed local state from API
  useEffect(() => {
    if (!settings) return;
    setSiteName(getVal("site_name", "Last Call Messages"));
    setTagline(getVal("tagline", ""));
    setContactEmail(getVal("contact_email", ""));
    setAddress(getVal("address", ""));
    setPhone(getVal("phone", ""));
    setEmailNotif(getVal("email_notifications", "true") === "true");
    setDonationNotif(getVal("donation_alerts", "true") === "true");
    setNewSubNotif(getVal("new_subscriber_alerts", "false") === "true");
    setWeeklyDigest(getVal("weekly_digest", "true") === "true");
    setDarkMode(getVal("dark_mode", "false") === "true");
    setCompactSidebar(getVal("compact_sidebar", "false") === "true");
    setMaintenanceMode(getVal("maintenance_mode", "false") === "true");
    setRequireApproval(getVal("require_approval", "true") === "true");
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(
      [
        { key: "site_name", value: siteName, group: "general" },
        { key: "tagline", value: tagline, group: "general" },
        { key: "contact_email", value: contactEmail, group: "general" },
        { key: "address", value: address, group: "general" },
        { key: "phone", value: phone, group: "general" },
        { key: "email_notifications", value: String(emailNotif), group: "notifications" },
        { key: "donation_alerts", value: String(donationNotif), group: "notifications" },
        { key: "new_subscriber_alerts", value: String(newSubNotif), group: "notifications" },
        { key: "weekly_digest", value: String(weeklyDigest), group: "notifications" },
        { key: "dark_mode", value: String(darkMode), group: "appearance" },
        { key: "compact_sidebar", value: String(compactSidebar), group: "appearance" },
        { key: "maintenance_mode", value: String(maintenanceMode), group: "security" },
        { key: "require_approval", value: String(requireApproval), group: "security" },
      ],
      {
        onSuccess: () => toast({ title: "Settings saved", description: "Your changes have been applied." }),
        onError: () => toast({ title: "Failed to save settings", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your site configuration</p>
          </div>
          <Button className="bg-gradient-gold text-primary font-semibold gap-2 hover:opacity-90" onClick={handleSave}>
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              <Globe className="w-4 h-4" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              <Bell className="w-4 h-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              <Palette className="w-4 h-4" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Site Name</Label>
                    <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="bg-background border-border focus-visible:ring-gold" maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="bg-background border-border focus-visible:ring-gold" maxLength={200} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="bg-background border-border focus-visible:ring-gold" maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label>Ministry Address</Label>
                  <Textarea value={address} onChange={(e) => setAddress(e.target.value)} className="bg-background border-border focus-visible:ring-gold min-h-[80px]" maxLength={300} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-background border-border focus-visible:ring-gold" maxLength={20} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6">
                {[
                  { label: "Email notifications", desc: "Receive email alerts for important events", state: emailNotif, set: setEmailNotif },
                  { label: "Donation alerts", desc: "Get notified when a new donation is received", state: donationNotif, set: setDonationNotif },
                  { label: "New subscriber alerts", desc: "Get notified when someone joins the newsletter", state: newSubNotif, set: setNewSubNotif },
                  { label: "Weekly digest", desc: "Receive a weekly summary of activity", state: weeklyDigest, set: setWeeklyDigest },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.state} onCheckedChange={item.set} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6">
                {[
                  { label: "Dark mode", desc: "Use dark theme for the admin dashboard", state: darkMode, set: setDarkMode },
                  { label: "Compact sidebar", desc: "Reduce sidebar width for more content space", state: compactSidebar, set: setCompactSidebar },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.state} onCheckedChange={item.set} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6">
                {[
                  { label: "Maintenance mode", desc: "Take the public site offline temporarily", state: maintenanceMode, set: setMaintenanceMode },
                  { label: "Require content approval", desc: "New content must be approved before publishing", state: requireApproval, set: setRequireApproval },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.state} onCheckedChange={item.set} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
