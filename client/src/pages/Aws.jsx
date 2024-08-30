import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaCloud, FaServer, FaTools, FaRobot } from 'react-icons/fa';
import QuestoesGeradasAws from '../components/QuestoesGeradasAws'; // Importe o novo componente

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #ff9900;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const Button = styled.button`
  background-color: #ff9900;
  color: #232f3e;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e07c00;
  }

  &:focus {
    outline: none;
  }
`;

const QuestionsContainer = styled.div`
  margin-top: 2rem;
  color: #ffffff;
`;

const Aws = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 

  const fetchQuestions = async (nivelCertificacao) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`http://localhost:5000/gerar-perguntas/${nivelCertificacao}`);
      setQuestions(response.data.perguntas);
      setShowQuestions(true); // Muda o estado para exibir o componente QuestoesGeradas
    } catch (err) {
      setError('Erro ao buscar perguntas.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (nivelCertificacao) => {
    fetchQuestions(nivelCertificacao);
  };

  return (
    <Container>
     
        <>
          <Title>AWS Certifications</Title>
          <ButtonContainer>
            <Button >
              <FaCloud />
              <QuestoesGeradasAws/> 
              Cloud Practitioner
            </Button>
            
            <Button onClick={() => handleButtonClick('associate')}>
              <FaServer /> Associate
            </Button>
            <Button onClick={() => handleButtonClick('professional')}>
              <FaTools /> Professional
            </Button>
            <Button onClick={() => handleButtonClick('ai_ml')}>
              <FaRobot /> AI & ML
            </Button>
          </ButtonContainer>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </>

    </Container>
  );
};

export default Aws;
