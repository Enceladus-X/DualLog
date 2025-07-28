interface Match {
  yourDeck: string
  opponentDeck: string
  position: "first" | "second"
  result: "win" | "lose"
  timestamp: string
  winStreak: number
  note?: string
}

export interface DeckStats {
  deck: string
  wins: number
  losses: number
  total: number
  winRate: number
  avgWinStreak: number
}

export interface MatchupStats {
  yourDeck: string
  opponentDeck: string
  wins: number
  losses: number
  total: number
  winRate: number
}

export interface PositionStats {
  first: {
    wins: number
    losses: number
    total: number
    winRate: number
  }
  second: {
    wins: number
    losses: number
    total: number
    winRate: number
  }
}

export interface TimeStats {
  time: string
  wins: number
  losses: number
  total: number
  winRate: number
}

export interface StreakStats {
  maxStreak: number
  currentStreak: number
  streakHistory: number[]
}

// 최고 승률 덱 찾기
export function getBestDeck(matches: Match[]): DeckStats | undefined {
  const deckMap = new Map<string, { wins: number; losses: number; streaks: number[] }>()

  matches.forEach((match) => {
    const deck = match.yourDeck
    if (!deckMap.has(deck)) {
      deckMap.set(deck, { wins: 0, losses: 0, streaks: [] })
    }
    const stats = deckMap.get(deck)!

    if (match.result === "win") {
      stats.wins++
      if (match.winStreak > 0) {
        stats.streaks.push(match.winStreak)
      }
    } else {
      stats.losses++
    }
  })

  return Array.from(deckMap.entries())
    .map(([deck, stats]) => ({
      deck,
      wins: stats.wins,
      losses: stats.losses,
      total: stats.wins + stats.losses,
      winRate: stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      avgWinStreak: stats.streaks.length > 0 ? stats.streaks.reduce((a, b) => a + b, 0) / stats.streaks.length : 0,
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .filter((d) => d.total >= 10)[0]
}

// 가장 많이 플레이한 덱 찾기
export function getMostPlayedDeck(matches: Match[]): { deck: string; count: number } | undefined {
  const deckCount = new Map<string, number>()

  matches.forEach((match) => {
    const deck = match.yourDeck
    deckCount.set(deck, (deckCount.get(deck) || 0) + 1)
  })

  const sortedDecks = Array.from(deckCount.entries()).sort((a, b) => b[1] - a[1])

  return sortedDecks.length > 0 ? { deck: sortedDecks[0][0], count: sortedDecks[0][1] } : undefined
}

// 연승 통계 계산
export function getStreakStats(matches: Match[]): StreakStats {
  let maxStreak = 0
  let currentStreak = 0
  const streakHistory: number[] = []

  matches.forEach((match) => {
    if (match.result === "win") {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      if (currentStreak > 0) {
        streakHistory.push(currentStreak)
      }
      currentStreak = 0
    }
  })

  if (currentStreak > 0) {
    streakHistory.push(currentStreak)
  }

  return { maxStreak, currentStreak, streakHistory }
}

// 덱별 통계 계산
export function getDeckStats(matches: Match[]): DeckStats[] {
  const deckMap = new Map<string, { wins: number; losses: number; streaks: number[] }>()

  matches.forEach((match) => {
    const deck = match.yourDeck
    if (!deckMap.has(deck)) {
      deckMap.set(deck, { wins: 0, losses: 0, streaks: [] })
    }
    const stats = deckMap.get(deck)!

    if (match.result === "win") {
      stats.wins++
      if (match.winStreak > 0) {
        stats.streaks.push(match.winStreak)
      }
    } else {
      stats.losses++
    }
  })

  return Array.from(deckMap.entries())
    .map(([deck, stats]) => ({
      deck,
      wins: stats.wins,
      losses: stats.losses,
      total: stats.wins + stats.losses,
      winRate: stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      avgWinStreak: stats.streaks.length > 0 ? stats.streaks.reduce((a, b) => a + b, 0) / stats.streaks.length : 0,
    }))
    .sort((a, b) => b.winRate - a.winRate)
}

// 매치업 통계 계산
export function getMatchupStats(matches: Match[]): MatchupStats[] {
  const matchupMap = new Map<string, { wins: number; losses: number }>()

  matches.forEach((match) => {
    const key = `${match.yourDeck} vs ${match.opponentDeck}`
    if (!matchupMap.has(key)) {
      matchupMap.set(key, { wins: 0, losses: 0 })
    }
    const stats = matchupMap.get(key)!

    if (match.result === "win") {
      stats.wins++
    } else {
      stats.losses++
    }
  })

  return Array.from(matchupMap.entries())
    .map(([key, stats]) => {
      const [yourDeck, opponentDeck] = key.split(" vs ")
      return {
        yourDeck,
        opponentDeck,
        wins: stats.wins,
        losses: stats.losses,
        total: stats.wins + stats.losses,
        winRate: stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
      }
    })
    .filter((stat) => stat.total >= 3)
    .sort((a, b) => b.winRate - a.winRate)
}

// 선후공 통계 계산
export function getPositionStats(matches: Match[]): PositionStats {
  const firstStats = { wins: 0, losses: 0 }
  const secondStats = { wins: 0, losses: 0 }

  matches.forEach((match) => {
    if (match.position === "first") {
      match.result === "win" ? firstStats.wins++ : firstStats.losses++
    } else {
      match.result === "win" ? secondStats.wins++ : secondStats.losses++
    }
  })

  return {
    first: {
      ...firstStats,
      total: firstStats.wins + firstStats.losses,
      winRate:
        firstStats.wins + firstStats.losses > 0 ? (firstStats.wins / (firstStats.wins + firstStats.losses)) * 100 : 0,
    },
    second: {
      ...secondStats,
      total: secondStats.wins + secondStats.losses,
      winRate:
        secondStats.wins + secondStats.losses > 0
          ? (secondStats.wins / (secondStats.wins + secondStats.losses)) * 100
          : 0,
    },
  }
}

// 시간대별 통계 계산
export function getTimeStats(matches: Match[]): TimeStats[] {
  const timeSlots = {
    morning: { wins: 0, losses: 0 },
    afternoon: { wins: 0, losses: 0 },
    evening: { wins: 0, losses: 0 },
    night: { wins: 0, losses: 0 },
  }

  matches.forEach((match) => {
    const hour = new Date(match.timestamp).getHours()
    let slot: keyof typeof timeSlots

    if (hour >= 6 && hour < 12) slot = "morning"
    else if (hour >= 12 && hour < 18) slot = "afternoon"
    else if (hour >= 18 && hour < 24) slot = "evening"
    else slot = "night"

    match.result === "win" ? timeSlots[slot].wins++ : timeSlots[slot].losses++
  })

  return Object.entries(timeSlots)
    .map(([time, stats]) => ({
      time,
      ...stats,
      total: stats.wins + stats.losses,
      winRate: stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
    }))
    .filter((stat) => stat.total > 0)
}

// 연승 계산 (새 매치 추가시)
export function calculateWinStreak(matches: Match[], newResult: "win" | "lose"): number {
  if (newResult === "lose") return 0

  let streak = 1
  for (let i = matches.length - 1; i >= 0; i--) {
    if (matches[i].result === "win") {
      streak++
    } else {
      break
    }
  }
  return streak
}
