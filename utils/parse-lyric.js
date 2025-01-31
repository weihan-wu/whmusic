const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricString) {
    const lyricStrings = lyricString.split('\n')

    const lyricInfos = []
    for (const lineString of lyricStrings) {
        const timeResult = timeRegExp.exec(lineString)
        if (!timeResult) continue
        const minute = timeResult[1] * 60 * 1000
        const second = timeResult[2] * 1000
        const millsecondTime = timeResult[3]
        const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
        const time = minute + second + millsecond

        const text = lineString.replace(timeRegExp, "")
        lyricInfos.push({ time, text })
    }
    return lyricInfos
}