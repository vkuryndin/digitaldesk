const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (data === null || typeof data !== 'object' || isArray(data)) {
    return false
  }

  if (typeof data.quizTitle !== 'string' || data.quizTitle.trim() === '') {
    return false
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  return data.attempts.every((attempt) => {
    if (attempt === null || typeof attempt !== 'object' || isArray(attempt)) {
      return false
    }

    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
      return false
    }

    return isArray(attempt.answers) &&
      attempt.answers.length === data.correctAnswers.length
  })
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0

  attempt.answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score += 1
    }
  })

  const percentage = Math.round((score / correctAnswers.length) * 100)

  return {
    name: attempt.name.trim(),
    score,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) =>
    calculateAttempt(attempt, data.correctAnswers)
  )

  let totalPercentage = 0
  let passedCount = 0
  let best = attempts[0]

  attempts.forEach((attempt) => {
    totalPercentage += attempt.percentage

    if (attempt.passed) {
      passedCount += 1
    }

    if (attempt.score > best.score) {
      best = attempt
    }
  })

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(totalPercentage / attempts.length),
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}
