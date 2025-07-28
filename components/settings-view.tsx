"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Save } from "lucide-react"

interface AppSettings {
  language: "ko" | "en"
  theme: "light" | "dark"
}

interface SettingsViewProps {
  settings: AppSettings
  onSave: (settings: AppSettings) => void
  onBack: () => void
  t: any
}

export default function SettingsView({ settings, onSave, onBack, t }: SettingsViewProps) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    onSave(localSettings)
    onBack()
  }

  return (
    <div className={`w-96 h-[600px] overflow-y-auto ${settings.theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className={settings.theme === "dark" ? "text-white hover:bg-gray-800" : "hover:bg-gray-100"}
          >
            ← {t.back}
          </Button>
          <h1 className={`text-lg font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
            {t.settings}
          </h1>
          <Button onClick={handleSave} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Save className="h-3 w-3 mr-1" />
            {t.save}
          </Button>
        </div>

        <div className="space-y-6">
          <Card
            className={`shadow-sm ${settings.theme === "dark" ? "bg-gray-800 border-gray-700" : "border-gray-200"}`}
          >
            <CardHeader className="pb-3">
              <CardTitle
                className={`text-sm font-semibold flex items-center ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}
              >
                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                {t.language}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button
                  onClick={() => setLocalSettings({ ...localSettings, language: "ko" })}
                  variant={localSettings.language === "ko" ? "default" : "outline"}
                  className={`flex-1 h-11 font-semibold transition-all ${
                    localSettings.language === "ko"
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                      : settings.theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                        : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {t.korean}
                </Button>
                <Button
                  onClick={() => setLocalSettings({ ...localSettings, language: "en" })}
                  variant={localSettings.language === "en" ? "default" : "outline"}
                  className={`flex-1 h-11 font-semibold transition-all ${
                    localSettings.language === "en"
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                      : settings.theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                        : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {t.english}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
