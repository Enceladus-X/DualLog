"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Globe, Save } from "lucide-react"

interface AppSettings {
  language: "ko" | "en"
  theme: "light" | "dark"
  communityUrl?: string
  developerMode?: boolean
  communityDefaultTitle?: string
  communityDefaultCategory?: string
  compactMode: boolean
  showWinStreak: boolean
}

interface SettingsViewProps {
  settings: AppSettings
  onSave: (settings: Partial<AppSettings>) => void
  onBack: () => void
  t: any
}

export default function SettingsView({ settings, onSave, onBack, t }: SettingsViewProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings)

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

          <Card
            className={`shadow-sm ${settings.theme === "dark" ? "bg-gray-800 border-gray-700" : "border-gray-200"}`}
          >
            <CardHeader className="pb-3">
              <CardTitle
                className={`text-sm font-semibold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}
              >
                커뮤니티 연동
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <Label htmlFor="community-url" className={settings.theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                글쓰기 페이지 URL (디시인사이드 마이너 갤러리)
              </Label>
              <Input
                id="community-url"
                placeholder="예: https://gall.dcinside.com/mgallery/board/write/?id=tcg"
                value={localSettings.communityUrl || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, communityUrl: e.target.value })}
                className={settings.theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : ""}
              />
            </CardContent>
          </Card>

          <Card
            className={`shadow-sm ${settings.theme === "dark" ? "bg-gray-800 border-gray-700" : "border-gray-200"}`}
          >
            <CardHeader className="pb-3">
              <CardTitle
                className={`text-sm font-semibold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}
              >
                개발자 모드
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="dev-mode" className={settings.theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  개발자 모드 활성화
                </Label>
                <Switch
                  id="dev-mode"
                  checked={!!localSettings.developerMode}
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, developerMode: checked })}
                />
              </div>
              <p className={settings.theme === "dark" ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>
                테스트용 데이터 주입, 디버그 로그 등 개발 편의 기능을 켭니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
