import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styled, { keyframes } from 'styled-components';
import { FaMicrophone, FaStop, FaSave } from 'react-icons/fa';
import "../App.css"
import axios from 'axios';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  height: auto;
  width: 30vw;
  background: linear-gradient(135deg, #8070a7, #4f0fe5);
  padding: 30px;
  animation: ${fadeIn} 1s ease-in-out;
  z-index: 2;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  -webkit-backdrop-filter: blur(39px);
  backdrop-filter: blur(39px);
  background-color: #ffffff4d;
  border-radius: 25px;
  box-shadow: 0 60px 120px #0b0046b3;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button.attrs(props => ({
  primary: props.primary || undefined,
}))`
  background-color: ${props => props.primary ? '#20b909' : '#ff1744'};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin: 0 15px;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:disabled {
    background-color: #c4c4c4;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:hover:enabled {
    background-color: ${props => props.primary ? '#470a91' : '#d50000'};
    transform: translateY(-2px);
  }
`;

const TextareaAutosize = styled.textarea`
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  -webkit-backdrop-filter: blur(39px);
  backdrop-filter: blur(39px);
  background-color: #ffffff4d;
  color: white;
  border-radius: 25px;
  flex-direction: column;
  align-items: flex-start;
  width: 356px;
  max-width: 356px;
  height: 404.291px;
  padding: 34px;
  display: flex;
  position: relative;

  &:focus {
    outline: none;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const Home = () => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'pt-BR' });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const saveTranscription = async () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `anotação_${timestamp}.txt`;
    const blob = new Blob([transcript], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', blob, fileName);

    try {
      const response = await axios.post('http://127.0.0.1:5000/salvar-transcricao', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        resetTranscript();
        alert(`Anotação salva como ${fileName}`);
      } else {
        alert('Erro ao salvar a anotação.');
      }
    } catch (error) {
      console.error('Erro ao salvar a anotação:', error);
      alert('Erro ao salvar a anotação.');
    }
  };

  return (
    <Container>
      <Title>Anota.AI</Title>

      <ButtonContainer>
        <Button primary={true} onClick={startListening} disabled={isListening}>
          <FaMicrophone />
          Iniciar 
        </Button>
        <Button onClick={stopListening} disabled={!isListening}>
          <FaStop />
          Parar
        </Button>
      </ButtonContainer>

      <TextareaAutosize rows={10} value={transcript} readOnly />

      <Button onClick={saveTranscription} disabled={!transcript}>
        <FaSave />
        Salvar Anotação
      </Button>
    </Container>
  );
};

export default Home;
