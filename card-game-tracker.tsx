"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

import SettingsView from "./components/settings-view"
import StatsView from "./components/stats-view"
import MainView from "./components/main-view"
import { loadCSVData, exportToCSV, importFromCSV, addMatchToData, removeMatchFromData } from "./utils/csv-utils"
import { getBestDeck, calculateWinStreak } from "./utils/stats-utils"
import ReportGenerator from "./components/report-generator"
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

interface DailyRecord {
  date: string
  matches: Match[]
  totalGames: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

interface MatchupStats {
  yourDeck: string
  opponentDeck: string
  wins: number
  losses: number
  total: number
  winRate: number
}

interface DeckStats {
  deck: string
  wins: number
  losses: number
  total: number
  winRate: number
  avgWinStreak: number
}

interface AppSettings {
  language: "ko" | "en"
  theme: "light" | "dark"
  compactMode: boolean
  showWinStreak: boolean
  autoSaveGames: number
  streakNotification: boolean
  winRateGoal: number
  communityUrl?: string
  communityDefaultTitle?: string
  communityDefaultCategory?: string
  developerMode?: boolean
}

const defaultSettings: AppSettings = {
  language: "ko",
  theme: "light",
  compactMode: false,
  showWinStreak: false,
  autoSaveGames: 0,
  streakNotification: false,
  winRateGoal: 0,
  communityUrl: "https://gall.dcinside.com/mgallery/board/write/?id=tcggame",
  communityDefaultTitle: "ㅇㅁㄱㄱ",
  communityDefaultCategory: "매칭",
  developerMode: false,
}

// 완전한 언어 텍스트 객체 - 모든 텍스트 포함
const texts = {
  ko: {
    appName: "Omegagu",
    stats: "통계",
    settings: "설정",
    back: "뒤로",
    save: "저장",
    todayGames: "오늘 게임",
    winRate: "승률",
    yourDeck: "내 덱",
    opponentDeck: "상대 덱",
    first: "선공",
    second: "후공",
    win: "승리",
    lose: "패배",
    add: "추가",
    noGames: "오늘의 전적이 없습니다",
    communityShare: "오메가구!!",
    sendToStats: "통계로 보내기",

    // 테이블 헤더
    yourDeckHeader: "내 덱",
    opponentHeader: "상대",
    positionHeader: "순서",
    resultHeader: "결과",

    // 설정 관련
    language: "언어",
    korean: "한국어",
    english: "English",
    theme: "테마",
    light: "라이트",
    dark: "다크",
    display: "표시 설정",
    showWinStreakLabel: "연승 표시",
    compactModeLabel: "컴팩트 모드",
    dataManagement: "데이터 관리",
    autoSave: "자동 저장",
    autoSaveDesc: "게임 수마다 자동으로 통계에 저장",
    disabled: "비활성화",
    notifications: "알림",
    streakNotificationLabel: "연승 알림",
    winRateGoalLabel: "목표 승률",
    clearAllData: "모든 데이터 삭제",
    exportData: "데이터 내보내기",
    importData: "데이터 불러오기",

    // 통계 관련
    overview: "개요",
    detailed: "상세",
    matchup: "매치업",
    history: "기록",
    totalWinRate: "전체 승률",
    totalGames: "총 게임",
    wins: "승",
    losses: "패",
    bestRecords: "최고 기록",
    maxWinStreak: "최다 연승",
    current: "현재",
    bestWinRateDeck: "최고 승률 덱",
    downloadReport: "오늘의 전적 리포트 확인하기",
    quarterAnalysis: "분기별 플레이 분석",
    q1: "1분기",
    q2: "2분기",
    q3: "3분기",
    q4: "4분기",

    // 추가 번역
    statsAnalysis: "통계 분석",
    csvExport: "CSV 내보내기",
    csvImport: "CSV 불러오기",
    mostPlayedDeck: "최다 플레이",
    sortCriteria: "정렬 기준",
    sortByWinRate: "승률순",
    sortByDeckName: "덱 이름 순",
    firstPosition: "선공 (FIRST)",
    secondPosition: "후공 (SECOND)",
    positionAnalysis: "선후공 분석",
    deckWinRate: "덱별 승률",
    timeAnalysis: "시간대별 분석",
    timePlayed: "시간대별 플레이 수",
    morning: "오전 (6-12시)",
    afternoon: "오후 (12-18시)",
    evening: "저녁 (18-24시)",
    night: "새벽 (0-6시)",
    matchupAnalysis: "매치업 분석",
    matchupMinGames: "매치업 분석을 위해서는 각 조합당 최소 3게임이 필요합니다",
    advantage: "우세",
    equal: "동등",
    disadvantage: "열세",
    allMatches: "전체 매치 기록",
    allDecks: "모든 덱",
    allOpponents: "모든 상대",
    allResults: "모든 결과",
    winsOnly: "승리만",
    lossesOnly: "패배만",
    sortByDate: "날짜순",
    sortByYourDeck: "내 덱순",
    sortByOpponentDeck: "상대 덱순",
    sortByResult: "결과순",
    noMatchHistory: "매치 기록이 없습니다",
    noDecksUsed: "사용된 덱이 없습니다",
    games: "게임",
    avgWinStreak: "평균 연승",

    // 알림 메시지
    noGamesRecorded: "기록된 게임이 없습니다!",
    streakAchieved: "연승 달성!",
    goalAchieved: "목표 승률",
    achieved: "달성!",
    todayStatsStored: "오늘의 전적이 통계에 저장되었습니다!",
    communityFeature: "커뮤니티 글 작성 기능 (개발 예정)",
    deleteConfirm: "이 기록을 삭제하시겠습니까?",
    clearAllConfirm: "정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    allDataCleared: "모든 데이터가 삭제되었습니다.",
    newMatchesAdded: "개의 새로운 매치가 추가되었습니다!",
    noNewMatches: "새로운 매치가 없습니다.",
    loadingData: "데이터를 불러오는 중...",
    dataLoadError: "데이터 로드 중 오류가 발생했습니다.",
    imageGenerated: "이미지가 생성되었습니다!",
    imageCopied: "이미지가 클립보드에 복사되었습니다!",
    imageCopyFailed: "이미지 복사에 실패했습니다. 다운로드를 시도합니다.",

    // 위치 표시
    firstShort: "선공",
    secondShort: "후공",
    firstAbbr: "1st",
    secondAbbr: "2nd",

    // 순위
    rank1: "1위",
    rank2: "2위",
    rank3: "3위",
  },
  en: {
    appName: "Omegagu",
    stats: "Stats",
    settings: "Settings",
    back: "Back",
    save: "Save",
    todayGames: "Today Games",
    winRate: "Win Rate",
    yourDeck: "Your Deck",
    opponentDeck: "Opponent Deck",
    first: "First",
    second: "Second",
    win: "WIN",
    lose: "LOSE",
    add: "ADD",
    noGames: "No today's games recorded",
    communityShare: "Community Share",
    sendToStats: "Send to Stats",

    // 테이블 헤더
    yourDeckHeader: "Your Deck",
    opponentHeader: "Opponent",
    positionHeader: "Position",
    resultHeader: "Result",

    // 설정 관련
    language: "Language",
    korean: "한국어",
    english: "English",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    display: "Display Settings",
    showWinStreakLabel: "Show Win Streak",
    compactModeLabel: "Compact Mode",
    dataManagement: "Data Management",
    autoSave: "Auto Save",
    autoSaveDesc: "Auto save to stats every N games",
    disabled: "Disabled",
    notifications: "Notifications",
    streakNotificationLabel: "Streak Notifications",
    winRateGoalLabel: "Win Rate Goal",
    clearAllData: "Clear All Data",
    exportData: "Export Data",
    importData: "Import Data",

    // 통계 관련
    overview: "Overview",
    detailed: "Detailed",
    matchup: "Matchup",
    history: "History",
    totalWinRate: "Total Win Rate",
    totalGames: "Total Games",
    wins: "Wins",
    losses: "Losses",
    bestRecords: "Best Records",
    maxWinStreak: "Max Win Streak",
    current: "Current",
    bestWinRateDeck: "Best Win Rate Deck",
    downloadReport: "View Today's Report",
    quarterAnalysis: "Quarterly Play Analysis",
    q1: "Q1",
    q2: "Q2",
    q3: "Q3",
    q4: "Q4",

    // 추가 번역
    statsAnalysis: "Statistics Analysis",
    csvExport: "CSV Export",
    csvImport: "CSV Import",
    mostPlayedDeck: "Most Played",
    sortCriteria: "Sort by",
    sortByWinRate: "Win Rate",
    sortByDeckName: "Deck Name",
    firstPosition: "First Position",
    secondPosition: "Second Position",
    positionAnalysis: "Position Analysis",
    deckWinRate: "Deck Win Rates",
    timeAnalysis: "Time Analysis",
    timePlayed: "Plays by Time of Day",
    morning: "Morning (6-12)",
    afternoon: "Afternoon (12-18)",
    evening: "Evening (18-24)",
    night: "Night (0-6)",
    matchupAnalysis: "Matchup Analysis",
    matchupMinGames: "Matchup analysis requires at least 3 games per combination",
    advantage: "Advantage",
    equal: "Equal",
    disadvantage: "Disadvantage",
    allMatches: "All Match Records",
    allDecks: "All Decks",
    allOpponents: "All Opponents",
    allResults: "All Results",
    winsOnly: "Wins Only",
    lossesOnly: "Losses Only",
    sortByDate: "Sort by Date",
    sortByYourDeck: "Sort by Your Deck",
    sortByOpponentDeck: "Sort by Opponent Deck",
    sortByResult: "Sort by Result",
    noMatchHistory: "No match records",
    noDecksUsed: "No decks used",
    games: "games",
    avgWinStreak: "Avg Win Streak",

    // 알림 메시지
    noGamesRecorded: "No games recorded!",
    streakAchieved: "Win Streak Achieved!",
    goalAchieved: "Win Rate Goal",
    achieved: "Achieved!",
    todayStatsStored: "Today's stats have been saved!",
    communityFeature: "Community feature (Coming Soon)",
    deleteConfirm: "Are you sure you want to delete this record?",
    clearAllConfirm: "Are you sure you want to delete all data? This action cannot be undone.",
    allDataCleared: "All data has been cleared.",
    newMatchesAdded: "new matches have been added!",
    noNewMatches: "No new matches found.",
    loadingData: "Loading data...",
    dataLoadError: "Error occurred while loading data.",
    imageGenerated: "Image generated successfully!",
    imageCopied: "Image copied to clipboard!",
    imageCopyFailed: "Failed to copy image. Downloading instead.",

    // 위치 표시
    firstShort: "First",
    secondShort: "Second",
    firstAbbr: "1st",
    secondAbbr: "2nd",

    // 순위
    rank1: "1st",
    rank2: "2nd",
    rank3: "3rd",
  },
}

export default function DualLogApp() {
  const [currentView, setCurrentView] = useState<"main" | "stats" | "settings">("main")
  const [yourDeck, setYourDeck] = useState("")
  const [opponentDeck, setOpponentDeck] = useState("")
  const [selectedOption, setSelectedOption] = useState<"first" | "second">("first")
  const [result, setResult] = useState<"win" | "lose">("win")
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultSettings)

  const [todayMatches, setTodayMatches] = useState<Match[]>([])
  const [allTimeStats, setAllTimeStats] = useState<DailyRecord[]>([])
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [showReportGenerator, setShowReportGenerator] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 현재 언어의 텍스트 가져오기
  const t = texts[appSettings.language]

  useEffect(() => {
    const initializeData = async () => {
      setIsLoadingData(true)

      // 설정 로드
      const storedSettings = localStorage.getItem("omegagu_settings")
      if (storedSettings) {
        setAppSettings({ ...defaultSettings, ...JSON.parse(storedSettings) })
      }

      const storedYourDeck = localStorage.getItem("last_your_deck")
      if (storedYourDeck) {
        setYourDeck(storedYourDeck)
      }

      const storedTodayMatches = localStorage.getItem(`today_matches_${today}`)
      if (storedTodayMatches) {
        setTodayMatches(JSON.parse(storedTodayMatches))
      } else {
        const now = new Date()
        const baseTime = (offset: number) => new Date(now.getTime() - offset * 60 * 60 * 1000).toISOString()
        const sample: Match[] = [
          { yourDeck: "Omega A", opponentDeck: "Beta X", position: "first", result: "win", timestamp: baseTime(1), winStreak: 1 },
          { yourDeck: "Omega A", opponentDeck: "Gamma Y", position: "second", result: "lose", timestamp: baseTime(2), winStreak: 0 },
          { yourDeck: "Delta B", opponentDeck: "Beta X", position: "first", result: "win", timestamp: baseTime(3), winStreak: 1 },
          { yourDeck: "Delta B", opponentDeck: "Gamma Y", position: "second", result: "win", timestamp: baseTime(4), winStreak: 2 },
          { yourDeck: "Zeta C", opponentDeck: "Alpha Z", position: "first", result: "lose", timestamp: baseTime(5), winStreak: 0 },
        ]
        setTodayMatches(sample)
        localStorage.setItem(`today_matches_${today}`, JSON.stringify(sample))
      }

      const storedAllTimeStats = localStorage.getItem("all_time_stats")
      if (storedAllTimeStats) {
        setAllTimeStats(JSON.parse(storedAllTimeStats))
      }

      // CSV 데이터를 항상 로드하고 기존 데이터와 병합
      try {
        const csvMatches = await loadCSVData()
        console.log("CSV에서 로드된 매치 수:", csvMatches.length)

        const storedAllMatches = localStorage.getItem("all_matches")
        let existingMatches: Match[] = []

        if (storedAllMatches) {
          existingMatches = JSON.parse(storedAllMatches)
        }

        // CSV 데이터와 기존 데이터를 병합 (중복 제거)
        const existingTimestamps = new Set(existingMatches.map((m) => m.timestamp))
        const newCsvMatches = csvMatches.filter((m) => !existingTimestamps.has(m.timestamp))

        const allMatches = [...existingMatches, ...newCsvMatches].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )

        setAllMatches(allMatches)
        localStorage.setItem("all_matches", JSON.stringify(allMatches))

        console.log("총 매치 수:", allMatches.length)
      } catch (error) {
        console.error("CSV 로드 실패:", error)
        // CSV 로드 실패시 기존 데이터만 사용
        const storedAllMatches = localStorage.getItem("all_matches")
        if (storedAllMatches) {
          setAllMatches(JSON.parse(storedAllMatches))
        }
      }

      setIsLoadingData(false)
    }

    initializeData()
  }, [today])

  const saveSettings = (newSettings: any) => {
    const merged = { ...appSettings, ...newSettings }
    setAppSettings(merged)
    localStorage.setItem("omegagu_settings", JSON.stringify(merged))
    toast.success("저장 완료")
  }

  const handleAddMatch = () => {
    if (!yourDeck.trim() || !opponentDeck.trim()) return

    localStorage.setItem("last_your_deck", yourDeck)

    const currentWinStreak = calculateWinStreak(todayMatches, result)

    const newMatch: Match = {
      yourDeck,
      opponentDeck,
      position: selectedOption,
      result,
      timestamp: new Date().toISOString(),
      winStreak: currentWinStreak,
    }

    // 오늘 매치에 추가
    const updatedTodayMatches = [...todayMatches, newMatch]
    setTodayMatches(updatedTodayMatches)
    localStorage.setItem(`today_matches_${today}`, JSON.stringify(updatedTodayMatches))

    // 전체 매치 데이터에 추가
    const updatedAllMatches = addMatchToData(newMatch, allMatches)
    setAllMatches(updatedAllMatches)

    if (appSettings.autoSaveGames > 0 && updatedTodayMatches.length >= appSettings.autoSaveGames) {
      handleFinishDay()
      return
    }

    if (appSettings.streakNotification && currentWinStreak >= 5 && result === "win") {
      toast.info(`🔥 ${currentWinStreak}${t.streakAchieved}`)
    }

    setYourDeck("")
    setOpponentDeck("")
    setResult("win")
    setSelectedOption("first")
  }

  const handleFinishDay = () => {
    if (todayMatches.length === 0) {
      toast.warn(t.noGamesRecorded)
      return
    }

    const wins = todayMatches.filter((m) => m.result === "win").length
    const losses = todayMatches.filter((m) => m.result === "lose").length
    const draws = 0
    const totalGames = todayMatches.length
    const winRate = (wins / totalGames) * 100

    const dailyRecord: DailyRecord = {
      date: today,
      matches: todayMatches,
      totalGames,
      wins,
      losses,
      draws,
      winRate,
    }

    const updatedAllTimeStats = [...allTimeStats, dailyRecord]
    setAllTimeStats(updatedAllTimeStats)
    localStorage.setItem("all_time_stats", JSON.stringify(updatedAllTimeStats))

    if (appSettings.streakNotification && winRate >= appSettings.winRateGoal) {
      toast.success(`🎯 ${t.goalAchieved} ${appSettings.winRateGoal}% ${t.achieved} (${winRate.toFixed(1)}%)`)
    }

    setTodayMatches([])
    localStorage.removeItem(`today_matches_${today}`)

    toast.success("통계로 전송 완료")
  }

  const handleWriteCommunityPost = async () => {
    // 간단 텍스트 리포트 생성 (오늘 기준)
    const wins = todayMatches.filter((m) => m.result === "win").length
    const losses = todayMatches.filter((m) => m.result === "lose").length
    const winRate = todayMatches.length > 0 ? ((wins / todayMatches.length) * 100).toFixed(1) : "0.0"
    const todayStr = new Date().toISOString().split("T")[0]

    const lines: string[] = []
    lines.push(`🎮 ${t.appName} 전적 리포트`)
    lines.push(`📅 ${todayStr}`)
    lines.push("".padEnd(30, "="))
    lines.push("")
    lines.push(`🎯 오늘의 전적`)
    lines.push(`• 총 게임: ${todayMatches.length}게임`)
    lines.push(`• 승리: ${wins}게임 | 패배: ${losses}게임`)
    lines.push(`• 승률: ${winRate}%`)
    lines.push("")
    if (todayMatches.length > 0) {
      lines.push("🏆 게임 기록")
      todayMatches.forEach((match, i) => {
        const position = match.position === "first" ? t.firstShort : t.secondShort
        const result = match.result === "win" ? t.wins : t.losses
        lines.push(`${i + 1}. ${match.yourDeck} vs ${match.opponentDeck} (${position}) → ${result}`)
      })
      lines.push("")
    }
    lines.push("".padEnd(30, "="))
    lines.push(`Generated by ${t.appName}`)

    const text = lines.join("\n")

    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error("클립보드 복사 실패:", error)
    }

    if (appSettings.communityUrl && appSettings.communityUrl.trim()) {
      window.open(appSettings.communityUrl, "_blank")
      // 간단 안내
      setTimeout(() => {
        toast.info(`복사 완료 — 말머리: ${appSettings.communityDefaultCategory || "매칭"}, 제목: ${appSettings.communityDefaultTitle || "ㅇㅁㄱㄱ"}. 본문은 클립보드에 복사되었습니다.`)
      }, 300)
    } else {
      toast.info("복사 완료 — 리포트 텍스트를 클립보드에 복사했습니다. 설정에서 커뮤니티 글쓰기 URL을 등록하면 글쓰기 페이지를 자동으로 열어드릴게요.")
    }
  }

  const handleDeleteMatch = (indexToDelete: number) => {
    // confirm 제거: 즉시 삭제하고 토스트로 알림
    const matchToDelete = todayMatches[indexToDelete]

    const updatedTodayMatches = todayMatches.filter((_, index) => index !== indexToDelete)
    setTodayMatches(updatedTodayMatches)
    localStorage.setItem(`today_matches_${today}`, JSON.stringify(updatedTodayMatches))

    const updatedAllMatches = removeMatchFromData(matchToDelete, allMatches)
    setAllMatches(updatedAllMatches)

    toast.success(`삭제됨 — ${matchToDelete.yourDeck} vs ${matchToDelete.opponentDeck}`)
  }

  const handleExportCSV = () => {
    exportToCSV(allMatches, "Omegagu_AllMatches")
  }

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    importFromCSV(
      file,
      allMatches,
      (newMatches, updatedMatches) => {
        setAllMatches(updatedMatches)
        localStorage.setItem("all_matches", JSON.stringify(updatedMatches))
        toast.success(`${newMatches.length}${t.newMatchesAdded}`)
      },
      (error) => {
        toast.error(String(error))
      },
    )
  }

  const clearAllData = () => {
    // confirm 제거: 즉시 삭제하고 토스트로 알림
    localStorage.removeItem("all_time_stats")
    localStorage.removeItem("all_matches")
    localStorage.removeItem(`today_matches_${today}`)
    setAllTimeStats([])
    setAllMatches([])
    setTodayMatches([])
    toast.success(t.allDataCleared)
  }

  const handleGenerateReport = () => {
    setShowReportGenerator(true)
  }

  if (isLoadingData) {
    return (
      <div
        className={`w-96 h-[600px] flex items-center justify-center ${appSettings.theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className={`text-center ${appSettings.theme === "dark" ? "text-white" : "text-gray-800"}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>{t.loadingData}</p>
        </div>
      </div>
    )
  }

  if (currentView === "settings") {
    return <SettingsView settings={appSettings} onSave={saveSettings} onBack={() => setCurrentView("main")} t={t} />
  }

  if (currentView === "stats") {
    return (
      <StatsView
        allTimeStats={allTimeStats}
        todayMatches={todayMatches}
        allMatches={allMatches}
        onBack={() => setCurrentView("main")}
        onExportCSV={handleExportCSV}
        onImportCSV={() => fileInputRef.current?.click()}
        bestDeck={getBestDeck(allMatches)}
        t={t}
        settings={appSettings}
      />
    )
  }

  const todayWins = todayMatches.filter((m) => m.result === "win").length
  const todayWinRate = todayMatches.length > 0 ? (todayWins / todayMatches.length) * 100 : 0
  const currentStreak = todayMatches.length > 0 ? todayMatches[todayMatches.length - 1].winStreak : 0

  return (
    <div>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImportCSV} style={{ display: "none" }} />
      <MainView
        yourDeck={yourDeck}
        setYourDeck={setYourDeck}
        opponentDeck={opponentDeck}
        setOpponentDeck={setOpponentDeck}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        result={result}
        setResult={setResult}
        todayMatches={todayMatches}
        appSettings={appSettings}
        onAddMatch={handleAddMatch}
        onDeleteMatch={handleDeleteMatch}
        onWriteCommunityPost={handleWriteCommunityPost}
        onFinishDay={handleFinishDay}
        onNavigateToSettings={() => setCurrentView("settings")}
        onNavigateToStats={() => setCurrentView("stats")}
        onGenerateReport={handleGenerateReport}
        t={t}
      />
      <ReportGenerator
        todayMatches={todayMatches}
        allMatches={allMatches}
        isOpen={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
        t={t}
        settings={appSettings}
      />
    </div>
  )
}
