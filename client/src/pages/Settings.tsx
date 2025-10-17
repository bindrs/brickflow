import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function Settings() {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState<any>({});

  useEffect(() => {
    if (settings) {
      const settingsObj = settings.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      setLocalSettings(settingsObj);
    }
  }, [settings]);

  const handleInputChange = (key: string, value: string) => {
    setLocalSettings({ ...localSettings, [key]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const settingsArray = Object.entries(localSettings).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      await updateSettings(settingsArray);
      toast({
        title: "Settings Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6 max-w-md">
        <div>
          <Label htmlFor="deliveryCharge">Delivery Charge (PKR)</Label>
          <Input
            id="deliveryCharge"
            type="number"
            value={localSettings.deliveryCharge || ""}
            onChange={(e) => handleInputChange("deliveryCharge", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="laborCharge">Labor Charge (PKR)</Label>
          <Input
            id="laborCharge"
            type="number"
            value={localSettings.laborCharge || ""}
            onChange={(e) => handleInputChange("laborCharge", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            step="0.01"
            value={localSettings.taxRate || ""}
            onChange={(e) => handleInputChange("taxRate", e.target.value)}
          />
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}