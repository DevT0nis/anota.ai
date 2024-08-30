import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTimes } from 'react-icons/fa';

// Definição de animações e estilos para o modal
// ...

const Modal = ({ show, onClose, questionData }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsCorrect(option.isCorrect);
  };

  const handleAnimationEnd = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    onClose();
  };

  return (
    <>
      <Container show={show}>
        <ModalContent>
          <CloseIcon onClick={onClose} />
          <Question>{questionData.question}</Question>
          <Options>
            {questionData.options.map((option, index) => (
              <OptionButton key={index} onClick={() => handleOptionClick(option)}>
                {option.text}
              </OptionButton>
            ))}
          </Options>
        </ModalContent>
      </Container>
      <FullScreenMessage
        show={selectedOption !== null}
        isCorrect={isCorrect}
        onAnimationEnd={handleAnimationEnd}
      >
        {isCorrect ? 'Correct!' : 'Wrong!'}
      </FullScreenMessage>
    </>
  );
};

export default Modal;
