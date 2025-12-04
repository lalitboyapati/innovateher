import { useState } from 'react';

interface SurveyProps {
  onComplete: () => void;
}

export default function Survey({ onComplete }: SurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | number }>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "How would you rate your overall experience at InnovateHer?",
      type: "rating",
      options: [1, 2, 3, 4, 5]
    },
    {
      id: 2,
      question: "How clear were the instructions and guidelines?",
      type: "rating",
      options: [1, 2, 3, 4, 5]
    },
    {
      id: 3,
      question: "How likely are you to participate in future InnovateHer events?",
      type: "rating",
      options: [1, 2, 3, 4, 5]
    },
    {
      id: 4,
      question: "Do you have any additional feedback or suggestions?",
      type: "text"
    }
  ];

  const handleAnswer = (value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Here you would typically send the survey data to your API
    console.log('Survey responses:', answers);
    
    // For now, we'll just mark as submitted
    setSubmitted(true);
    
    // Wait a moment then call onComplete
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
        <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
          <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontSize: '1.2rem' }}>
            Thank you for your feedback!
          </p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg p-8 relative" style={{ border: '3px solid #000' }}>
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute top-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 rounded" style={{ backgroundColor: '#c8999980' }}></div>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e5e5e5' }}>
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  backgroundColor: '#c89999'
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h3 className="mb-6" style={{ fontFamily: 'Georgia, serif', color: '#333', fontSize: '1.5rem' }}>
            {currentQ.question}
          </h3>

          {/* Answer options */}
          {currentQ.type === 'rating' && (
            <div className="mb-8">
              <div className="flex justify-between items-center gap-4">
                {currentQ.options.map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleAnswer(rating)}
                    className="flex-1 py-4 rounded-md transition hover:opacity-80"
                    style={{
                      border: '2px solid #000',
                      backgroundColor: answers[currentQuestion] === rating ? '#c89999' : 'white',
                      color: answers[currentQuestion] === rating ? 'white' : '#333',
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>Poor</span>
                <span style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>Excellent</span>
              </div>
            </div>
          )}

          {currentQ.type === 'text' && (
            <div className="mb-8">
              <textarea
                value={answers[currentQuestion] as string || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Share your thoughts..."
                rows={6}
                className="w-full px-4 py-3 rounded-md focus:outline-none transition resize-none"
                style={{ 
                  border: '2px solid #000',
                  fontFamily: 'Georgia, serif'
                }}
              />
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'white',
                color: '#c89999',
                border: '2px solid #000',
                fontFamily: 'Georgia, serif',
                fontWeight: '600'
              }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!hasAnswer}
              className="px-6 py-3 rounded-md transition hover:opacity-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#c89999',
                color: '#fff',
                border: '2px solid #000',
                fontFamily: 'Georgia, serif',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}
            >
              {isLastQuestion ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

