/** Clearly labelled sample data for people without a Canvas file. Not real assignments. */
export function sampleAssignments(now = new Date()) {
  const at = (days, hour, minute = 59) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour, minute)
    return d.toISOString()
  }
  const rows = [
    ['Problem Set 4: Pointers and Memory', 'CS 211', 1, 23, 120],
    ['Reading Response: Chapter 7', 'PSYC 101', 2, 17, 45],
    ['Lab Report 3: Titration', 'CHEM 120', 3, 23, 150],
    ['Draft of Research Essay', 'ENGL 201', 5, 23, 180],
    ['Quiz 5 (online)', 'MATH 240', 6, 12, 30],
    ['Group Project Outline', 'BUSN 150', 9, 23, 60],
  ]
  return rows.map(([title, course, days, hour, minutes], i) => ({
    id: `sample-${i}`,
    title,
    course,
    dueAt: at(days, hour),
    allDay: false,
    kind: 'assignment',
    source: 'sample-demo',
    estimatedMinutes: minutes, // sample estimates only: real Canvas files don't include these
    context: null,
    url: null,
  }))
}
