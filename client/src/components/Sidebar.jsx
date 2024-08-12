import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaBars, FaTimes, FaBookmark, FaFileAlt, FaHome } from 'react-icons/fa';

const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
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
    transform: translateX();
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const Container = styled.div`
  width: ${(props) => (props.isOpen ? '250px' : '80px')};
  height: 100vh;
  background: linear-gradient(135deg, #3a3a3a, #6a00ff);
  animation: ${(props) => (props.isOpen ? slideIn : slideOut)} 0.3s forwards;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: width 0.3s ease;
  border-radius: 0 20px 20px 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  color: #fff;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  margin-top: 30px;
  margin-left: ${(props) => (props.isOpen ? '100px' : '0px')};
  padding: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 1.5em;
  transition: all 0.3s ease;
  &:hover {
    color: #8f10e9;
    transform: scale(1.1);
  }
`;

const Logo = styled.img`
  width: ${(props) => (props.isOpen ? '50px' : '40px')};
  height: ${(props) => (props.isOpen ? '50px' : '40px')};
  margin-top: 30px;
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  transition: all 0.3s ease;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavItem = styled.li`
  width: 100%;
  padding: 10px 20px;
  transition: all 0.3s ease;
  animation: ${(props) => (props.isOpen ? fadeIn : fadeOut)} 0.3s ease forwards;
`;

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  color: #fff;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1em;
  padding: 15px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1));
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #8f10e9, #6a00ff);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  svg {
    margin-right: 10px;
    font-size: 1.3em;
  }
`;

const Header = styled.div`
width: 70%;

display: flex;
align-items: center;
justify-content: center;





 
`;

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
  text-align: center;
  font-size: 0.8em;
  color: #ffffff;
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  transition: opacity 0.3s ease;
  padding: 0 15px;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContainer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container isOpen={isOpen}>
      <Header>
        <Link to="/">
          <Logo src="./public/Designer (7).png" alt="Logo" isOpen={isOpen} />
        </Link>
        <ToggleButton onClick={toggleContainer} isOpen={isOpen}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </ToggleButton>
      </Header>
      <NavList>
      <NavItem isOpen={isOpen}>
          <NavButton to="/" isOpen={isOpen}>
            <FaHome />
            Inicio
          </NavButton>
        </NavItem>
        <NavItem isOpen={isOpen}>
          <NavButton to="/saved-notes" isOpen={isOpen}>
            <FaBookmark />
            Anotações Salvas
          </NavButton>
        </NavItem>
   
      </NavList>
      <Footer isOpen={isOpen}>
        <p>Criado com ❤️ por <br />Anthony Thomas.</p>
        <p>© 2024 Todos os direitos reservados.</p>
      </Footer>
    </Container>
  );
};

export default Sidebar;
