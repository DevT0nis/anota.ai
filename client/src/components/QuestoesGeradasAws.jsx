import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { AiOutlineCloud } from "react-icons/ai";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff, #ffffff);
  animation: ${fadeIn} 1s ease-in-out;
  z-index: 2;
  -webkit-backdrop-filter: blur(39px);
  backdrop-filter: blur(39px);
  border-radius: 25px;
  box-shadow: 0 60px 120px #0b0046b3;
`;

const QuestionBox = styled.div`
  width: 100%;
  padding: 20px;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  background-color: #ecebed;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const OptionsList = styled.div`
  margin-top: 20px;
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  color: black;
  cursor: pointer;
  background: linear-gradient(145deg, #ffffff, #e0e0e0);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
    transform: scale(1.05);
  }

  &:active {
    background: linear-gradient(145deg, #e0e0e0, #ffffff);
    transform: scale(0.98);
  }
`;

const greenGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 30px green;
  }
  50% {
    box-shadow: 0 0 60px green;
  }
`;

const redGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 30px red;
  }
  50% {
    box-shadow: 0 0 60px red;
  }
`;

const ResultMessage = styled.div`
  margin-top: 20px;
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: ${(props) => (props.success ? "#13f146" : "#f4152b")};
  border-radius: 10px;
  animation: ${(props) => (props.success ? greenGlow : redGlow)} 1s infinite;
`;

const Explanation = styled.div`
  margin-top: 30px;
  padding: 10px;
  font-size: 16px;
  color: #333;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const NextButton = styled.button`
  margin-top: 20px;
  padding: 15px 25px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background: linear-gradient(145deg, #007bff, #007bff);
  color: #fff;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #0056b3, #004d99);
    transform: scale(1.05);
  }

  &:active {
    background: linear-gradient(145deg, #004d99, #003d7a);
    transform: scale(0.98);
  }
`;

const CloudButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: #007bff;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #0056b3;
    transform: scale(1.1);
  }

  &:active {
    background: #004d99;
    transform: scale(0.9);
  }
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 23px;
  height: 10vh;
  text-align: center;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-top: 20px;
  color: #ffffff;
  background-color: red;
  width: 50%;
  height: 50%;
  border-radius: 23px;
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-top: 20px;
  color: #ffffff;
  background-color: #0adf4a;
  width: 50%;
  height: 50%;
  border-radius: 23px;
`;

const ResultSummary = styled.div`
display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  top: 5;
  left: 5;
  width: 50%;
  height: 50%;
  padding: 20px;
  background: #fff;
color: black;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 18px;

  h3 {
    margin-bottom: 10px;
    color: #333;
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 600;
  background-color: #ecebed;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  }
  p{
    color: #333;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  background-color: #ecebed;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: start;
  }
`;

const FinishButton = styled.button`
  margin-top: 20px;
  padding: 15px 25px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background: linear-gradient(145deg, #ff7b7b, #ff4d4d);
  color: #fff;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #ff5656, #ff2d2d);
    transform: scale(1.05);
  }

  &:active {
    background: linear-gradient(145deg, #ff2d2d, #ff5656);
    transform: scale(0.98);
  }
`;

const QuestoesGeradasAws = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutos em segundos
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(
        "http://localhost:5000/listar-perguntas"
      );
      setQuestions(response.data);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionClick = (option) => {
    const correctAnswer = questions[currentQuestionIndex].resposta_correta;
    setSelectedOption(option);
    const isAnswerCorrect = option === correctAnswer;
    setIsCorrect(isAnswerCorrect);

    const timeSpent = (Date.now() - questionStartTime) / 1000; // Tempo gasto em segundos
    setTotalTimeSpent(totalTimeSpent + timeSpent);

    // Atualiza a pontuação e contadores de acertos/erros
    if (isAnswerCorrect) {
      setScore(score + 1000 / questions.length); // Cada resposta correta vale uma fração do total
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setQuestionStartTime(Date.now()); // Reinicia o tempo para a próxima pergunta
  };

  const handleFinishTest = () => {
    setCurrentQuestionIndex(questions.length); // Finaliza a prova
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  if (currentQuestionIndex >= totalQuestions) {
    const averageTimePerQuestion = totalTimeSpent / totalQuestions;
    const isPassed = score >= 700; // Verifica se a pontuação é suficiente

    return (
      <ResultSummary>
        <h3>Resultado Final</h3>
        <p>Número de acertos: {correctAnswers}</p>
        <p>Número de erros: {incorrectAnswers}</p>
        <p>
          Tempo médio por pergunta: {averageTimePerQuestion.toFixed(2)} segundos
        </p>
        <p>Pontuação final: {Math.round(score)}</p>
        <ResultMessage success={isPassed}>
          {isPassed ? "Aprovado! Parabéns!" : "Não aprovado. Tente novamente!"}
        </ResultMessage>
      </ResultSummary>
    );
  }

  return (
    <>
      <CloudButton onClick={toggleModal}>
        <AiOutlineCloud />
      </CloudButton>
      <ModalBackground show={showModal} onClick={toggleModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <QuestionBox>
            <Box>
              <Score>Pontuação: {Math.round(score)}</Score>
              <Timer>Tempo Restante: {formatTime(timeLeft)}</Timer>
            </Box>
            <h2>{currentQuestion.pergunta}</h2>

            <OptionsList>
              {currentQuestion.opcoes.map((option, index) => (
                <OptionButton
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionsList>
            {selectedOption && (
              <>
                <ResultMessage success={isCorrect}>
                  {isCorrect ? "Correto!" : "Incorreto!"}
                </ResultMessage>
                <Explanation>{currentQuestion.explicacao}</Explanation>
              </>
            )}
            {selectedOption && currentQuestionIndex < totalQuestions - 1 && (
              <NextButton onClick={handleNextQuestion}>
                Próxima Pergunta
              </NextButton>
            )}
            {/* Botão para finalizar a prova manualmente */}
            <FinishButton onClick={handleFinishTest}>
              Finalizar Prova
            </FinishButton>
          </QuestionBox>
        </ModalContent>
      </ModalBackground>
    </>
  );
};

export default QuestoesGeradasAws;