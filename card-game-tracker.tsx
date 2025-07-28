"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

import SettingsView from "./components/settings-view"
import StatsView from "./components/stats-view"
import MainView from "./components/main-view"
import { loadCSVData, exportToCSV, importFromCSV, addMatchToData, removeMatchFromData } from "./utils/csv-utils"
import { getBestDeck, calculateWinStreak } from "./utils/stats-utils"
import ReportGenerator from "./components/report-generator"

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
  autoSaveGames: number
  streakNotification: boolean
  winRateGoal: number
}

const defaultSettings: AppSettings = {
  language: "ko",
  theme: "light",
  autoSaveGames: 0,
  streakNotification: false,
  winRateGoal: 0,
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
    communityShare: "커뮤니티 공유",
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
    downloadReport: "오늘 전적 리포트 다운로드",

    // 추가 번역
    statsAnalysis: "통계 분석",
    csvExport: "CSV 내보내기",
    csvImport: "CSV 불러오기",
    mostPlayedDeck: "최다 플레이",
    firstPosition: "선공 (FIRST)",
    secondPosition: "후공 (SECOND)",
    positionAnalysis: "선후공 분석",
    deckWinRate: "덱별 승률",
    timeAnalysis: "시간대별 분석",
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
    downloadReport: "Download Today's Report",

    // 추가 번역
    statsAnalysis: "Statistics Analysis",
    csvExport: "CSV Export",
    csvImport: "CSV Import",
    mostPlayedDeck: "Most Played",
    firstPosition: "First Position",
    secondPosition: "Second Position",
    positionAnalysis: "Position Analysis",
    deckWinRate: "Deck Win Rates",
    timeAnalysis: "Time Analysis",
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

  const saveSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings)
    localStorage.setItem("omegagu_settings", JSON.stringify(newSettings))
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
      alert(`🔥 ${currentWinStreak}${t.streakAchieved}`)
    }

    setYourDeck("")
    setOpponentDeck("")
    setResult("win")
    setSelectedOption("first")
  }

  const handleFinishDay = () => {
    if (todayMatches.length === 0) {
      alert(t.noGamesRecorded)
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
      alert(`🎯 ${t.goalAchieved} ${appSettings.winRateGoal}% ${t.achieved} (${winRate.toFixed(1)}%)`)
    }

    setTodayMatches([])
    localStorage.removeItem(`today_matches_${today}`)

    alert(`${t.todayStatsStored}\n${t.totalGames} ${totalGames}${t.games}, ${t.winRate} ${winRate.toFixed(1)}%`)
  }

  const handleWriteCommunityPost = () => {
    alert(t.communityFeature)
  }

  const handleDeleteMatch = (indexToDelete: number) => {
    if (confirm(t.deleteConfirm)) {
      const matchToDelete = todayMatches[indexToDelete]

      // 오늘 매치에서 삭제
      const updatedTodayMatches = todayMatches.filter((_, index) => index !== indexToDelete)
      setTodayMatches(updatedTodayMatches)
      localStorage.setItem(`today_matches_${today}`, JSON.stringify(updatedTodayMatches))

      // 전체 매치 데이터에서 삭제
      const updatedAllMatches = removeMatchFromData(matchToDelete, allMatches)
      setAllMatches(updatedAllMatches)
    }
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
        alert(`${newMatches.length}${t.newMatchesAdded}`)
      },
      (error) => {
        alert(error)
      },
    )
  }

  const clearAllData = () => {
    if (confirm(t.clearAllConfirm)) {
      localStorage.removeItem("all_time_stats")
      localStorage.removeItem("all_matches")
      localStorage.removeItem(`today_matches_${today}`)
      setAllTimeStats([])
      setAllMatches([])
      setTodayMatches([])
      alert(t.allDataCleared)
    }
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
