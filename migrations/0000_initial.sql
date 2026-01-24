-- Migrations for Quiz Submission System

-- Table for quiz submissions
CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    quizSlug TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for individual answers within a submission
CREATE TABLE IF NOT EXISTS submission_answers (
    id TEXT PRIMARY KEY,
    submissionId TEXT NOT NULL,
    questionId TEXT NOT NULL,
    selectedIndices TEXT, -- JSON array of numbers
    textAnswer TEXT,
    isCorrect BOOLEAN NOT NULL,
    FOREIGN KEY (submissionId) REFERENCES submissions (id) ON DELETE CASCADE
);

-- Index for performance on stats queries
CREATE INDEX IF NOT EXISTS idx_submission_answers_quiz_question ON submission_answers (questionId);
CREATE INDEX IF NOT EXISTS idx_submissions_quiz ON submissions (quizSlug);
