"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Download, Copy, Eye, BarChart3 } from "lucide-react"
import { toast } from "react-toastify"

interface Match {
  yourDeck: string
  opponentDeck: string
  position: "first" | "second"
  result: "win" | "lose"
  timestamp: string
  winStreak: number
  note?: string
}

interface ReportOptions {
  // 프라이버시
  hideDeckNames: boolean
  deckAlias: string
  hideOpponentNames: boolean
  // 전체 통계
  showAllTimeStats: boolean
}

interface ReportGeneratorProps {
  todayMatches: Match[]
  allMatches: Match[]
  isOpen: boolean
  onClose: () => void
  t: any
  settings: any
}

const defaultOptions: ReportOptions = {
  hideDeckNames: false,
  deckAlias: "내 덱",
  hideOpponentNames: false,
  showAllTimeStats: true,
}

export default function ReportGenerator({
  todayMatches,
  allMatches,
  isOpen,
  onClose,
  t,
  settings,
}: ReportGeneratorProps) {
  const [activeTab, setActiveTab] = useState("text")
  const [options, setOptions] = useState<ReportOptions>(defaultOptions)
  const [textPreview, setTextPreview] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // 현재 연승 계산 (오늘 기준)
  const getCurrentStreak = () => {
    if (todayMatches.length === 0) return 0

    let currentStreak = 0
    for (let i = todayMatches.length - 1; i >= 0; i--) {
      if (todayMatches[i].result === "win") {
        currentStreak++
      } else {
        break
      }
    }
    return currentStreak
  }

  // 전체 통계 계산
  const getAllTimeStats = () => {
    if (allMatches.length === 0) return null

    const wins = allMatches.filter((m) => m.result === "win").length
    const winRate = ((wins / allMatches.length) * 100).toFixed(1)
    const maxStreak = Math.max(...allMatches.map((m) => m.winStreak), 0)

    return {
      totalGames: allMatches.length,
      wins,
      losses: allMatches.length - wins,
      winRate: Number.parseFloat(winRate),
      maxStreak,
    }
  }

  // 텍스트 리포트 생성
  const generateTextReport = () => {
    if (todayMatches.length === 0 && !options.showAllTimeStats) return "게임 기록이 없습니다."

    const wins = todayMatches.filter((m) => m.result === "win").length
    const winRate = todayMatches.length > 0 ? ((wins / todayMatches.length) * 100).toFixed(1) : "0.0"
    const currentStreak = getCurrentStreak()
    const today = new Date().toLocaleDateString("ko-KR")
    const allTimeStats = getAllTimeStats()

    let report = ""

    // 헤더 (앱명 문구 제거, 날짜만)
    report += `📅 ${today}\n`
    report += `${"=".repeat(30)}\n\n`

    // 전체 통계 (옵션)
    if (options.showAllTimeStats && allTimeStats) {
      report += `📊 전체 통계 (누적)\n`
      report += `• 총 게임: ${allTimeStats.totalGames}게임\n`
      report += `• 승리: ${allTimeStats.wins}게임 | 패배: ${allTimeStats.losses}게임\n`
      report += `• 승률: ${allTimeStats.winRate}%\n`
      // 최고 연승 제거
      // 추가: 최다 플레이 덱, 최고 승률 덱
      const mostPlayed = (() => {
        const count = new Map<string, number>()
        allMatches.forEach((m) => count.set(m.yourDeck, (count.get(m.yourDeck) || 0) + 1))
        const arr = Array.from(count.entries()).sort((a, b) => b[1] - a[1])
        return arr.length ? { deck: arr[0][0], count: arr[0][1] } : null
      })()
      const bestDeck = (() => {
        const map = new Map<string, { w: number; l: number }>()
        allMatches.forEach((m) => {
          const s = map.get(m.yourDeck) || { w: 0, l: 0 }
          m.result === "win" ? (s.w += 1) : (s.l += 1)
          map.set(m.yourDeck, s)
        })
        const arr = Array.from(map.entries())
          .map(([deck, s]) => ({ deck, total: s.w + s.l, winRate: s.w + s.l > 0 ? (s.w / (s.w + s.l)) * 100 : 0 }))
          .filter((d) => d.total >= 3)
          .sort((a, b) => b.winRate - a.winRate)
        return arr[0] || null
      })()
      if (mostPlayed) {
        report += `• 최다 플레이 덱: ${mostPlayed.deck} (${mostPlayed.count}게임)\n`
      }
      if (bestDeck) {
        report += `• 최고 승률 덱: ${bestDeck.deck} (${bestDeck.winRate.toFixed(1)}%)\n`
      }
      report += `\n`
    }

    // 오늘의 전적
    if (todayMatches.length > 0) {
      report += `🎯 오늘의 전적\n`
      report += `• 총 게임: ${todayMatches.length}게임\n`
      report += `• 승리: ${wins}게임 | 패배: ${todayMatches.length - wins}게임\n`
      report += `• 승률: ${winRate}%\n`
      if (currentStreak > 0) {
        report += `• 현재 연승: ${currentStreak}연승 ⚡\n`
      }
      report += `\n`

      // 게임 목록
      report += `🏆 게임 기록\n`
      todayMatches.forEach((match, i) => {
        const yourDeck = options.hideDeckNames ? options.deckAlias : match.yourDeck
        const opponentDeck = options.hideOpponentNames ? "상대" : match.opponentDeck
        const position = match.position === "first" ? "선공🚀" : "후공🛡️"
        const result = match.result === "win" ? "승리" : "패배"
        const resultEmoji = match.result === "win" ? "✅" : "❌"
        const streakText = match.winStreak > 1 ? ` (${match.winStreak}연승!)` : ""

        report += `${i + 1}. ${yourDeck} vs ${opponentDeck} (${position}) → ${result}${resultEmoji}${streakText}\n`
      })
    } else if (!options.showAllTimeStats) {
      report += `🎯 오늘의 전적\n`
      report += `아직 기록된 게임이 없습니다.\n`
    }

    report += `\n${"=".repeat(30)}\n`
    report += `Generated by ${t.appName}`

    return report
  }

  // 이미지 리포트 기능 제거

  // 옵션 변경시 미리보기 업데이트
  useEffect(() => {
    if (!isOpen) return
      setTextPreview(generateTextReport())
  }, [options, activeTab, isOpen, todayMatches, allMatches])

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textPreview)
      toast.success("복사 완료 — 텍스트 리포트가 클립보드에 복사되었습니다.")
    } catch (error) {
      console.error("텍스트 복사 실패:", error)
    }
  }

  const handleDownloadText = () => {
    const blob = new Blob([textPreview], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Omegagu_Report_${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 이미지 복사 제거

  // 이미지 다운로드 제거

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-3xl h-[70vh] rounded-lg shadow-xl ${settings.theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="flex h-full">
          {/* 옵션 패널 */}
          <div
            className={`w-60 border-r overflow-y-auto ${settings.theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200"}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  리포트 생성기
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={"text"} className="mb-4">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="text">텍스트</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                {/* 전체 통계 옵션 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      통계 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-all-stats" className="text-sm">
                        전체 통계 표시
                      </Label>
                      <Switch
                        id="show-all-stats"
                        checked={options.showAllTimeStats}
                        onCheckedChange={(checked) => setOptions({ ...options, showAllTimeStats: checked })}
                      />
                    </div>
                    <p className={`text-xs mt-2 ${settings.theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      CSV에 저장된 모든 전적 통계를 포함합니다
                    </p>
                  </CardContent>
                </Card>

                {/* 프라이버시 설정 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      프라이버시 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-deck" className="text-sm">
                        덱 이름 숨기기
                      </Label>
                      <Switch
                        id="hide-deck"
                        checked={options.hideDeckNames}
                        onCheckedChange={(checked) => setOptions({ ...options, hideDeckNames: checked })}
                      />
                    </div>
                    {options.hideDeckNames && (
                      <div>
                        <Label htmlFor="deck-alias" className="text-sm">
                          덱 별명
                        </Label>
                        <Input
                          id="deck-alias"
                          value={options.deckAlias}
                          onChange={(e) => setOptions({ ...options, deckAlias: e.target.value })}
                          className="mt-1"
                          placeholder="예: 내 덱"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-opponent" className="text-sm">
                        상대 이름 숨기기
                      </Label>
                      <Switch
                        id="hide-opponent"
                        checked={options.hideOpponentNames}
                        onCheckedChange={(checked) => setOptions({ ...options, hideOpponentNames: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 이미지 안내 제거 */}
            </div>
          </div>

          {/* 미리보기 패널 */}
          <div className="flex-1 flex flex-col">
            <div className={`p-4 border-b ${settings.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${settings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  미리보기
                </h3>
                <div className="flex gap-2">
                  <Button onClick={handleCopyText} size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    복사
                  </Button>
                  <Button onClick={handleDownloadText} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    다운로드
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
                <div
                className={`w-full h-full p-3 rounded border font-mono text-sm whitespace-pre-wrap ${
                    settings.theme === "dark"
                      ? "bg-gray-800 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {textPreview}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
