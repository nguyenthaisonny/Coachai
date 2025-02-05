'use server';
import { checkUserLogin } from '@/actions/user';
import geminiModel, {
  getCleanedGeminiResponse,
} from '@/AIs/gemini/gemini-model';
import { db } from '@/lib/prisma';

export async function generateQuestions(): Promise<Question[]> {
  const { user } = await checkUserLogin();
  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(', ')}` : ''
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;
  try {
    const result = await geminiModel.generateContent(prompt);
    const quiz = getCleanedGeminiResponse(result);
    return quiz.questions;
  } catch (error) {
    console.error('Erro generating quiz', error);
    throw new Error('Failed to generate quize question');
  }
}

export async function saveQuizResult({
  questions,
  answers,
}: RawQuizResult): Promise<Assessment> {
  const { user } = await checkUserLogin();
  const questionResults: QuestionResult[] = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));
  let totalQuestion = questions.length;
  let scoreOfOneQuestion = 100 / totalQuestion;
  let score = 0;
  questionResults.map(({ isCorrect }) => {
    if (isCorrect) score += scoreOfOneQuestion;
  });

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`,
      )
      .join('\n\n');

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await geminiModel.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error('Error generating improvement tip:', error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: 'Technical',
        improvementTip,
      },
    });
    return assessment;
  } catch (error) {
    console.error('Erro saving quiz result: ', error);
    throw new Error('Failed to save quiz result');
  }
}

export async function getAssessments(): Promise<Assessment[]> {
  const { user } = await checkUserLogin();
  try {
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return assessments;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
}
