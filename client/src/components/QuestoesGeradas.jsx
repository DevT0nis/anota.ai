import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const shake = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateY(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateY(10px);
  }
`;

const slideIn = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const slideOut = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const ModalContainer = styled.div`
  width: 600px;
  height: 400px;
  background: linear-gradient(135deg, #403e3e, #7F00FF);
  position: fixed;
  
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  animation: ${(props) => (props.isOpen ? slideIn : slideOut)} 0.3s forwards;
  border-radius: 30px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const ToggleButton = styled.button`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 20px;
  right: 20px;
  padding: 10px;
  background: linear-gradient(135deg, #403e3e, #7F00FF);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 50px;
  height: 50px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  color: #fff;
  font-size: 20px;
  transition: all 0.3s ease;
  z-index: 1001;

  animation: ${shake} 3.5s ease;
  animation-iteration-count: infinite;
  animation-play-state: paused;

  &:nth-child(even) {
    animation-play-state: running;
  }

  &:hover {
    background-color: #ff0000;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '✨';
    font-size: 24px;
    color: #fff;
    align-items: center;
  }
`;

const Title = styled.h1`
  color: aliceblue;
  font-size: 22px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  margin: 10px;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const Question = styled.div`
  margin: 0 0 10px 0;
  font-size: 1.1em;
  text-align: center;
`;

const AnswerInput = styled.input`
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 80%;
  margin-bottom: 10px;
  font-size: 1em;
`;

const ValidateButton = styled.button`
  padding: 10px 20px;
  background-color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 1em;
  transition: all 0.3s ease;

  &:hover {
    background-color: #8f10e9;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ErrorMessage = styled.div`
  background-color: #ff4d4f;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: #fff;
  color: black;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const ModalContent = styled.p`
  margin: 20px 0;
`;

const QuestoesGeradas = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/listar-perguntas');
        if (response.status === 200) {
          console.log('Perguntas recebidas:', response.data);
          setQuestions(response.data);
        } else {
          setError('Erro ao obter perguntas.');
        }
      } catch (error) {
        console.error('Erro ao obter perguntas:', error);
        setError('Erro ao obter perguntas.');
      }
    };

    fetchQuestions();

    const intervalId = setInterval(() => {
      fetchQuestions();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const validateAnswer = async (question) => {
    const resposta = userAnswer;
    const textoReferencia = question.resposta_esperada;

    if (!resposta || !textoReferencia) {
        setError('Por favor, preencha o campo antes de validar.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/avaliar-resposta', {
            resposta: resposta,
            texto_referencia: textoReferencia,
        });

        if (response.status === 200) {
            const { nota, feedback } = response.data;
            if (nota === 100) {
                setUserAnswer('');
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    setModalTitle('Parabéns!');
                    setModalContent('Você respondeu todas as perguntas corretamente!');
                    setModalOpen(true);
                }
            } else {
                setModalTitle('Tente novamente');
                setModalContent(`Nota: ${nota}%\nFeedback: ${feedback}`);
                setModalOpen(true);
            }
        } else {
            setError('Erro ao avaliar resposta.');
        }
    } catch (error) {
        console.error('Erro ao avaliar resposta:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.erro : 'Erro desconhecido ao avaliar resposta.');
    }
};


  const toggleContainer = () => {
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <ToggleButton onClick={toggleContainer} />
      <ModalBackground isOpen={isOpen} onClick={toggleContainer}>
        <ModalContainer isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Title>Pergunta Atual:</Title>
          {currentQuestion ? (
            <Card>
              <Question>{currentQuestion.pergunta}</Question>
              <AnswerInput
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Digite sua resposta..."
              />
              <ValidateButton onClick={() => validateAnswer(currentQuestion)}>Validar</ValidateButton>
            </Card>
          ) : (
            <div>Nenhuma pergunta disponível no momento.</div>
          )}
        </ModalContainer>
      </ModalBackground>

      {modalOpen && (
        <ModalBackground>
          <Modal>
            <ModalTitle>{modalTitle}</ModalTitle>
            <ModalContent>{modalContent}</ModalContent>
            <button onClick={closeModal}>Fechar</button>
          </Modal>
        </ModalBackground>
      )}
    </>
  );
};

export default QuestoesGeradas;
