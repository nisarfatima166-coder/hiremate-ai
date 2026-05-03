function cleanText(s) {
  return String(s ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim()
}

function pickTopSkills(skills) {
  const list = Array.isArray(skills) ? skills : String(skills ?? '').split(',')
  return list
    .map((s) => String(s).trim())
    .filter(Boolean)
    .slice(0, 6)
}

function inferRoleFromExperience(experience) {
  const exp = cleanText(experience).toLowerCase()
  if (!exp) return 'professional'
  if (exp.includes('frontend') || exp.includes('front-end')) return 'frontend developer'
  if (exp.includes('backend') || exp.includes('back-end')) return 'backend developer'
  if (exp.includes('full stack') || exp.includes('full-stack')) return 'full-stack developer'
  if (exp.includes('data')) return 'data professional'
  if (exp.includes('design') || exp.includes('ui') || exp.includes('ux')) return 'product designer'
  return 'professional'
}

/**
 * Simulated AI: generates a professional summary paragraph from inputs.
 * Intended to be swapped with a real AI call later.
 */
export function generateResumeSummary({ experience, skills }) {
  const role = inferRoleFromExperience(experience)
  const topSkills = pickTopSkills(skills)

  const hasExperience = cleanText(experience).length > 20
  const hasSkills = topSkills.length > 0

  const first = hasExperience
    ? `Results-driven ${role} with hands-on experience delivering production-ready features and collaborating across teams.`
    : `Motivated ${role} focused on building high-quality, user-centric solutions.`

  const second = hasSkills
    ? `Strong in ${topSkills.join(', ')}, with a focus on clean architecture, performance, and clear communication.`
    : `Strong communicator with a focus on clean architecture, performance, and continuous improvement.`

  const third =
    'Known for ownership, fast iteration, and attention to detail—bringing ideas from concept to polished delivery.'

  return [first, second, third].join(' ')
}

