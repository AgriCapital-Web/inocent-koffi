import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Bell, Shield, Globe, Palette, Loader2 } from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState({
    site_name: "Inocent KOFFI - AGRICAPITAL",
    contact_email: "Inocent.koffi@agricapital.ci",
    phone: "",
    address: "Abidjan, Côte d'Ivoire",
    social_facebook: "",
    social_linkedin: "",
    social_twitter: "",
  });

  const [appearance, setAppearance] = useState({
    primary_color: "#1e3a5f",
    accent_color: "#d4a72c",
    font_family: "Inter",
    show_newsletter: true,
    show_testimonials: true,
  });

  const [notifications, setNotifications] = useState({
    enable_notifications: true,
    enable_newsletter: true,
    auto_approve_testimonials: false,
    maintenance_mode: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      data?.forEach((setting: any) => {
        if (setting.setting_key === 'general') setGeneral(prev => ({ ...prev, ...setting.setting_value }));
        if (setting.setting_key === 'appearance') setAppearance(prev => ({ ...prev, ...setting.setting_value }));
        if (setting.setting_key === 'notifications') setNotifications(prev => ({ ...prev, ...setting.setting_value }));
      });
    } catch (e) {
      console.error("Error loading settings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        { setting_key: 'general', setting_value: general },
        { setting_key: 'appearance', setting_value: appearance },
        { setting_key: 'notifications', setting_value: notifications },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ 
            setting_key: update.setting_key, 
            setting_value: update.setting_value,
            updated_at: new Date().toISOString()
          }, { onConflict: 'setting_key' });
        if (error) throw error;
      }

      toast({ title: "Paramètres sauvegardés", description: "Les modifications sont appliquées sur tout le site." });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Paramètres Généraux</CardTitle>
          <CardDescription>Configuration de base du site — appliquée automatiquement partout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom du Site</Label>
              <Input value={general.site_name} onChange={(e) => setGeneral({ ...general, site_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email de Contact</Label>
              <Input type="email" value={general.contact_email} onChange={(e) => setGeneral({ ...general, contact_email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input value={general.social_facebook} onChange={(e) => setGeneral({ ...general, social_facebook: e.target.value })} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input value={general.social_linkedin} onChange={(e) => setGeneral({ ...general, social_linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-2">
              <Label>Twitter URL</Label>
              <Input value={general.social_twitter} onChange={(e) => setGeneral({ ...general, social_twitter: e.target.value })} placeholder="https://twitter.com/..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications & Modération</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { label: "Notifications par Email", desc: "Recevoir des notifications pour les nouveaux messages", key: "enable_notifications" as const },
            { label: "Newsletter", desc: "Activer le formulaire d'inscription", key: "enable_newsletter" as const },
            { label: "Approbation Automatique", desc: "Approuver automatiquement les témoignages", key: "auto_approve_testimonials" as const },
            { label: "Mode Maintenance", desc: "Activer le mode maintenance", key: "maintenance_mode" as const },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{item.label}</Label>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key] as boolean}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Apparence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Couleur Principale</Label>
              <div className="flex gap-2">
                <Input type="color" value={appearance.primary_color} onChange={(e) => setAppearance({ ...appearance, primary_color: e.target.value })} className="w-16 h-10 p-1" />
                <Input value={appearance.primary_color} onChange={(e) => setAppearance({ ...appearance, primary_color: e.target.value })} className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur d'Accent</Label>
              <div className="flex gap-2">
                <Input type="color" value={appearance.accent_color} onChange={(e) => setAppearance({ ...appearance, accent_color: e.target.value })} className="w-16 h-10 p-1" />
                <Input value={appearance.accent_color} onChange={(e) => setAppearance({ ...appearance, accent_color: e.target.value })} className="flex-1" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Afficher Newsletter</Label>
              <p className="text-sm text-muted-foreground">Afficher la section newsletter sur les pages</p>
            </div>
            <Switch checked={appearance.show_newsletter} onCheckedChange={(checked) => setAppearance({ ...appearance, show_newsletter: checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Afficher Témoignages</Label>
              <p className="text-sm text-muted-foreground">Afficher la section témoignages</p>
            </div>
            <Switch checked={appearance.show_testimonials} onCheckedChange={(checked) => setAppearance({ ...appearance, show_testimonials: checked })} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Sauvegarder les Paramètres
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
