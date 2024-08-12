import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const slideIn = keyframes`
  0% {
    transform: translateX(80%);
  }
  100% {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(80%);
  }
`;

const Container = styled.div`
  width: 320px;
  height: 100vh;
  background: linear-gradient(135deg, #403e3e, #7F00FF);
  position: fixed;
  text-align: center;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  animation: ${(props) => (props.isOpen ? slideIn : slideOut)} 0.3s forwards;
  border-radius: 30px 0 0 30px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ToggleButton = styled.button`
  margin-top: 30px;
  margin-right: 250px;
  padding: 10px;
  background-color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #8f10e9;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.active ? "0 10px 20px rgba(0, 0, 0, 0.2)" : "0 10px 20px rgba(0, 0, 0, 0.2)"};
  }
`;

const Title = styled.h1`
  color: aliceblue;
  font-size: 22px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
`;

const QuestionList = styled.div`
  padding: 0;
  margin: 20px 0 0 0;
  width: 100%;
  color: #fff;
  overflow-y: auto;
  flex-grow: 1;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, and Opera */
  }
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
    box-shadow: ${(props) =>
      props.active ? "0 10px 20px rgba(0, 0, 0, 0.2)" : "0 10px 20px rgba(0, 0, 0, 0.2)"};
  }
`;

const ErrorMessage = styled.div`
  background-color: #ff4d4f;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
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
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/listar-perguntas');
        if (response.status === 200) {
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
    }, 5000); // Consulta a cada 5 segundos

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
  }, []);

  const handleInputChange = (index, value) => {
    setUserAnswers({
      ...userAnswers,
      [index]: value,
    });
  };

  const validateAnswer = async (index, question) => {
    try {
        const response = await axios.post('http://localhost:5000/avaliar-resposta', {
            resposta: userAnswers[index],
            texto_referencia: question.texto_referencia // Certifique-se de que isso é o que você precisa enviar
        });

        if (response.status === 200) {
            const { nota, feedback } = response.data;
            setValidationResults({
                ...validationResults,
                [index]: {
                    isCorrect: nota === 100, // Ajustar conforme o critério de resposta correta
                    feedback,
                },
            });
            setModalTitle('Resultado da Avaliação');
            setModalContent(`Nota: ${nota}%\nFeedback: ${feedback}`);
            setModalOpen(true);
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

  return (
    <Container isOpen={isOpen}>
      <ToggleButton onClick={toggleContainer}>{isOpen ? '✕' : '☰'}</ToggleButton>
      {isOpen && (
        <>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Title>Perguntas Geradas:</Title>
          <QuestionList>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <Card key={index}>
                  <Question>{question.pergunta}</Question>
                  <AnswerInput
                    type="text"
                    value={userAnswers[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                  <ValidateButton onClick={() => validateAnswer(index, question)}>Validar</ValidateButton>
                  {validationResults[index] && validationResults[index].isCorrect && (
                    <div>
                      <strong>Resposta Correta: </strong>
                      {userAnswers[index]}
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <p>Nenhuma pergunta gerada ainda.</p>
            )}
          </QuestionList>
        </>
      )}
      <ModalBackground isOpen={modalOpen} onClick={closeModal}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalContent>{modalContent}</ModalContent>
          <ValidateButton onClick={closeModal}>Fechar</ValidateButton>
        </Modal>
      </ModalBackground>
    </Container>
  );
};

export default QuestoesGeradas;
