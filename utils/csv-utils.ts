interface Match {
  yourDeck: string
  opponentDeck: string
  position: "first" | "second"
  result: "win" | "lose"
  timestamp: string
  winStreak: number
  note?: string
}

// CSV 데이터를 로드하는 함수
export async function loadCSVData(): Promise<Match[]> {
  try {
    console.log("CSV 파일 로드 시작...")
    const response = await fetch("/test_cardgame_500cases_utf8sig.csv")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("CSV 텍스트 길이:", csvText.length)
    console.log("CSV 첫 몇 줄:", csvText.split("\n").slice(0, 3))

    const lines = csvText.split("\n")
    const matches: Match[] = []

    // 헤더 스킵하고 데이터 파싱
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",")
      if (values.length >= 7) {
        try {
          const match: Match = {
            yourDeck: values[2].trim(),
            opponentDeck: values[3].trim(),
            position: values[4].trim() as "first" | "second",
            result: values[5].trim() as "win" | "lose",
            timestamp: new Date(`${values[0].trim()}T${values[1].trim()}:00`).toISOString(),
            winStreak: Number.parseInt(values[6].trim()) || 0,
            note: values[7] ? values[7].trim().replace(/"/g, "") : "",
          }
          matches.push(match)
        } catch (parseError) {
          console.warn(`라인 ${i} 파싱 실패:`, line, parseError)
        }
      }
    }

    console.log("파싱된 매치 수:", matches.length)
    console.log("첫 번째 매치:", matches[0])
    return matches
  } catch (error) {
    console.error("CSV 로드 오류:", error)
    return []
  }
}

// CSV로 내보내기
export function exportToCSV(matches: Match[], filename = "matches") {
  const csvContent =
    "\uFEFF" +
    [
      "Date,Time,YourDeck,OpponentDeck,Position,Result,WinStreak,Note",
      ...matches.map((match) => {
        const date = new Date(match.timestamp).toISOString().split("T")[0]
        const time = new Date(match.timestamp).toLocaleTimeString("en-GB", { hour12: false }).slice(0, 5)
        return `${date},${time},${match.yourDeck},${match.opponentDeck},${match.position},${match.result},${match.winStreak},"${match.note || ""}"`
      }),
    ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// CSV에서 가져오기
export function importFromCSV(
  file: File,
  existingMatches: Match[],
  onSuccess: (newMatches: Match[], updatedMatches: Match[]) => void,
  onError: (error: string) => void,
) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const csv = e.target?.result as string
      const lines = csv.split("\n")
      const importedMatches: Match[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",")
        if (values.length >= 7) {
          const match: Match = {
            yourDeck: values[2],
            opponentDeck: values[3],
            position: values[4] as "first" | "second",
            result: values[5] as "win" | "lose",
            timestamp: new Date(`${values[0]}T${values[1]}:00`).toISOString(),
            winStreak: Number.parseInt(values[6]) || 0,
            note: values[7]?.replace(/"/g, "") || "",
          }
          importedMatches.push(match)
        }
      }

      const existingTimestamps = new Set(existingMatches.map((m) => m.timestamp))
      const newMatches = importedMatches.filter((m) => !existingTimestamps.has(m.timestamp))

      if (newMatches.length > 0) {
        const updatedMatches = [...existingMatches, ...newMatches].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        onSuccess(newMatches, updatedMatches)
      } else {
        onError("새로운 매치가 없습니다.")
      }
    } catch (error) {
      onError("CSV 파일을 읽는 중 오류가 발생했습니다.")
    }
  }
  reader.readAsText(file)
}

// 새 매치를 기존 데이터에 추가
export function addMatchToData(newMatch: Match, existingMatches: Match[]): Match[] {
  const updatedMatches = [...existingMatches, newMatch].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  // localStorage에 저장
  localStorage.setItem("all_matches", JSON.stringify(updatedMatches))

  return updatedMatches
}

// 매치 삭제
export function removeMatchFromData(matchToDelete: Match, existingMatches: Match[]): Match[] {
  const updatedMatches = existingMatches.filter((match) => match.timestamp !== matchToDelete.timestamp)

  // localStorage에 저장
  localStorage.setItem("all_matches", JSON.stringify(updatedMatches))

  return updatedMatches
}
