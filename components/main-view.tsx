"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Settings, BarChart3, Plus, MessageSquare, Send, Trash2, Download } from "lucide-react"
import { useState } from "react"

interface Match {
  yourDeck: string
  opponentDeck: string
  position: "first" | "second"
  result: "win" | "lose"
  timestamp: string
  winStreak: number
  note?: string
}

interface AppSettings {
  language: "ko" | "en"
  theme: "light" | "dark"
  compactMode: boolean
  showWinStreak: boolean
}

interface MainViewProps {
  yourDeck: string
  setYourDeck: (value: string) => void
  opponentDeck: string
  setOpponentDeck: (value: string) => void
  selectedOption: "first" | "second"
  setSelectedOption: (value: "first" | "second") => void
  result: "win" | "lose"
  setResult: (value: "win" | "lose") => void
  todayMatches: Match[]
  appSettings: AppSettings
  onAddMatch: () => void
  onDeleteMatch: (index: number) => void
  onWriteCommunityPost: () => void
  onFinishDay: () => void
  onNavigateToSettings: () => void
  onNavigateToStats: () => void
  onGenerateReport: () => void
  t: any
}

export default function MainView({
  yourDeck,
  setYourDeck,
  opponentDeck,
  setOpponentDeck,
  selectedOption,
  setSelectedOption,
  result,
  setResult,
  todayMatches,
  appSettings,
  onAddMatch,
  onDeleteMatch,
  onWriteCommunityPost,
  onFinishDay,
  onNavigateToSettings,
  onNavigateToStats,
  onGenerateReport,
  t,
}: MainViewProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const todayWins = todayMatches.filter((m) => m.result === "win").length
  const todayWinRate = todayMatches.length > 0 ? (todayWins / todayMatches.length) * 100 : 0

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true)
    try {
      // await onGenerateImage()
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <div className={`w-96 h-[600px] overflow-y-auto ${appSettings.theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-xl font-bold ${appSettings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {t.appName}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToSettings}
              className={`p-2 ${appSettings.theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white"}`}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToStats}
              className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              {t.stats}
            </Button>
          </div>
        </div>

        <div className="flex gap-1.5 mb-3">
          <Input
            type="text"
            placeholder={t.yourDeck}
            value={yourDeck}
            onChange={(e) => setYourDeck(e.target.value)}
            className={`flex-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm ${
              appSettings.theme === "dark" ? "bg-gray-800 text-white border-gray-600" : ""
            }`}
          />
          <Input
            type="text"
            placeholder={t.opponentDeck}
            value={opponentDeck}
            onChange={(e) => setOpponentDeck(e.target.value)}
            className={`flex-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm ${
              appSettings.theme === "dark" ? "bg-gray-800 text-white border-gray-600" : ""
            }`}
          />
        </div>

        <div className="flex gap-1.5 mb-3">
          <Button
            onClick={() => setSelectedOption("first")}
            variant={selectedOption === "first" ? "default" : "outline"}
            className={`flex-1 h-11 font-semibold transition-all ${
              selectedOption === "first"
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                : appSettings.theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                  : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300"
            }`}
          >
            {t.first}
          </Button>
          <Button
            onClick={() => setSelectedOption("second")}
            variant={selectedOption === "second" ? "default" : "outline"}
            className={`flex-1 h-11 font-semibold transition-all ${
              selectedOption === "second"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-md"
                : appSettings.theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                  : "bg-white hover:bg-red-50 text-gray-700 border-gray-300"
            }`}
          >
            {t.second}
          </Button>
        </div>

        <div className="flex gap-1.5 mb-4">
          <Button
            onClick={() => setResult("win")}
            variant={result === "win" ? "default" : "outline"}
            className={`flex-1 h-11 font-semibold transition-all ${
              result === "win"
                ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                : appSettings.theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                  : "bg-white hover:bg-green-50 text-gray-700 border-gray-300"
            }`}
          >
            {t.win}
          </Button>
          <Button
            onClick={() => setResult("lose")}
            variant={result === "lose" ? "default" : "outline"}
            className={`flex-1 h-11 font-semibold transition-all ${
              result === "lose"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-md"
                : appSettings.theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                  : "bg-white hover:bg-red-50 text-gray-700 border-gray-300"
            }`}
          >
            {t.lose}
          </Button>
          <Button
            onClick={onAddMatch}
            disabled={!yourDeck.trim() || !opponentDeck.trim()}
            className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t.add}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card
            className={`shadow-sm ${appSettings.theme === "dark" ? "bg-gray-800 border-gray-700" : "border-gray-200"}`}
          >
            <CardContent className="p-4">
              <p
                className={`text-sm font-medium mb-1 ${appSettings.theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                {t.todayGames}
              </p>
              <p className={`text-2xl font-bold ${appSettings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                {todayMatches.length}
              </p>
            </CardContent>
          </Card>
          <Card
            className={`shadow-sm ${appSettings.theme === "dark" ? "bg-gray-800 border-gray-700" : "border-gray-200"}`}
          >
            <CardContent className="p-4">
              <p
                className={`text-sm font-medium mb-1 ${appSettings.theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                {t.winRate}
              </p>
              <p className={`text-2xl font-bold ${appSettings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                {todayWinRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card
          className={`mb-4 shadow-sm ${appSettings.theme === "dark" ? "bg-gray-800 border-gray-700" : "border-gray-200"}`}
        >
          <CardContent className="p-3">
            <div
              className={`rounded border ${
                appSettings.theme === "dark" ? "bg-gray-900 border-gray-600" : "bg-white border-gray-100"
              }`}
              style={{ maxHeight: appSettings.compactMode ? "120px" : "180px", overflowY: "auto" }}
            >
              {todayMatches.length === 0 ? (
                <div
                  className={`p-6 text-center text-sm ${appSettings.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  {t.noGames}
                </div>
              ) : (
                <table className="w-full">
                  <thead className={`sticky top-0 ${appSettings.theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                    <tr className={`border-b ${appSettings.theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
                      <th
                        className={`px-2 py-1.5 text-left text-xs font-semibold ${appSettings.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {t.yourDeckHeader}
                      </th>
                      <th
                        className={`px-2 py-1.5 text-left text-xs font-semibold ${appSettings.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {t.opponentHeader}
                      </th>
                      <th
                        className={`px-2 py-1.5 text-left text-xs font-semibold ${appSettings.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {t.positionHeader}
                      </th>
                      <th
                        className={`px-2 py-1.5 text-left text-xs font-semibold ${appSettings.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {t.resultHeader}
                      </th>
                      <th
                        className={`px-1 py-1.5 text-center text-xs font-semibold w-8 ${appSettings.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayMatches
                      .slice()
                      .reverse()
                      .map((match, reverseIndex) => {
                        const actualIndex = todayMatches.length - 1 - reverseIndex
                        return (
                          <tr
                            key={actualIndex}
                            className={`border-b text-xs transition-colors ${
                              appSettings.theme === "dark"
                                ? `border-gray-700 hover:bg-gray-700 ${match.result === "win" ? "bg-green-900/20" : "bg-red-900/20"}`
                                : `border-gray-100 hover:bg-gray-50 ${match.result === "win" ? "bg-green-50" : "bg-red-50"}`
                            }`}
                          >
                            <td className="px-2 py-1.5 font-medium truncate max-w-[45px]" title={match.yourDeck}>
                              {match.yourDeck}
                              {appSettings.showWinStreak && match.winStreak > 1 && (
                                <span className="ml-1 text-green-600 font-bold">+{match.winStreak}</span>
                              )}
                            </td>
                            <td className="px-2 py-1.5 font-medium truncate max-w-[45px]" title={match.opponentDeck}>
                              {match.opponentDeck}
                            </td>
                            <td
                              className={`px-2 py-1.5 font-semibold ${
                                match.position === "first" ? "text-blue-600" : "text-red-600"
                              }`}
                            >
                              {appSettings.language === "ko"
                                ? match.position === "first"
                                  ? t.firstShort
                                  : t.secondShort
                                : match.position === "first"
                                  ? t.firstAbbr
                                  : t.secondAbbr}
                            </td>
                            <td
                              className={`px-2 py-1.5 font-semibold ${
                                match.result === "win" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {match.result.toUpperCase()}
                            </td>
                            <td className="px-1 py-1.5 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteMatch(actualIndex)}
                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {/* 상단 버튼들 */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onWriteCommunityPost}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 shadow-lg transition-all text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {t.communityShare}
            </Button>
            <Button
              onClick={onFinishDay}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 shadow-md transition-all text-xs"
            >
              <Send className="h-3 w-3 mr-1" />
              {t.sendToStats}
            </Button>
          </div>

          {/* 하단 리포트 버튼 */}
          <Button
            onClick={onGenerateReport}
            disabled={todayMatches.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 shadow-md transition-all text-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            전적 리포트 생성
          </Button>
        </div>
      </div>
    </div>
  )
}
