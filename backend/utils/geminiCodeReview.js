const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeCode(code, challengeDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are a professional code reviewer for a programming challenge platform. 
    Carefully analyze the following code submission considering the challenge description.

    Challenge Description: ${challengeDescription}

    Code Submission:
    ${code}

    Provide a structured response with these key points:
    1. Correctness Assessment
       - Evaluate if the code solves the problem correctly
       - Clearly state PASS or FAIL

    2. Time Complexity
       - Determine Big O notation
       - Briefly explain the complexity

    3. Space Complexity
       - Determine memory usage efficiency
       - Specify Big O notation for space

    4. Code Feedback
       - Highlight code strengths
       - Be concise and constructive

    5. Improvement Suggestions
       - Offer specific recommendations
       - Identify potential improvements
       - Suggest optimization strategies

    OUTPUT FORMAT:
    Correctness: [PASS/FAIL]
    Time Complexity: [Big O Notation]
    Space Complexity: [Big O Notation]
    Code Feedback: [Concise analysis]
    Improvement Suggestions: [Specific recommendations]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the response
    const parseGeminiResponse = (text) => {
      const feedback = {
        status: 'incorrect',
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
        feedback: 'No detailed feedback available.',
        suggestion: 'No suggestions provided.'
      };

      const sectionMatchers = [
        { key: 'status', regex: /Correctness:\s*(\w+)/ },
        { key: 'timeComplexity', regex: /Time Complexity:\s*(.+)(?=\n|$)/ },
        { key: 'spaceComplexity', regex: /Space Complexity:\s*(.+)(?=\n|$)/ },
        { key: 'feedback', regex: /Code Feedback:\s*(.+)(?=\n|$)/s },
        { key: 'suggestion', regex: /Improvement Suggestions:\s*(.+)$/s }
      ];

      sectionMatchers.forEach(matcher => {
        const match = text.match(matcher.regex);
        if (match) {
          switch (matcher.key) {
            case 'status':
              feedback.status = match[1].toLowerCase().includes('pass') ? 'correct' : 'incorrect';
              break;
            case 'timeComplexity':
              feedback.timeComplexity = match[1].trim();
              break;
            case 'spaceComplexity':
              feedback.spaceComplexity = match[1].trim();
              break;
            case 'feedback':
              feedback.feedback = match[1].trim();
              break;
            case 'suggestion':
              feedback.suggestion = match[1].trim();
              break;
          }
        }
      });

      return feedback;
    };

    return parseGeminiResponse(text);

  } catch (error) {
    console.error("Gemini API Detailed Error:", {
      message: error.message,
      stack: error.stack,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    return {
      status: 'incorrect',
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      feedback: `Gemini Communication Error: ${error.message}`,
      suggestion: 'Please retry the submission or contact support.'
    };
  }
}

module.exports = { analyzeCode };