// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';

import NoteSaved from './pages/AnotacoesSalvas';


const Container = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 99vw;
  height: auto;
  width: auto;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 40%, #000000e5 100%);
`;

const MainContent = styled.div`


`;

function App() {
  return (
    <Router>
      <Container>
        <Sidebar />
  
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved-notes" element={<NoteSaved/>}/>
          </Routes>
        </MainContent>
      </Container>
    </Router>
  );
}

export default App;



// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import styled, { keyframes } from 'styled-components';
// import Sidebar from './components/Sidebar';
// import Home from './pages/Home';
// import QuestoesGeradas from './components/QuestoesGeradas';

// const Container = styled.div`
//   display: flex;
//   height: 100vh;
//   width: 100vw;
//   background: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0.8) 100%);
//   position: relative;
//   overflow: hidden;
// `;

// const MainContent = styled.div`
//   flex-grow: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   position: relative;
//   z-index: 2;
// `;

// const LargeOrangeLight = styled.div`
//   width: 400px;
//   height: 400px;
//   background: radial-gradient(circle, rgba(255, 165, 0, 1) 0%, rgba(255, 140, 0, 0.8) 50%, rgba(0, 0, 0, 0) 100%);
//   position: absolute;
//   top: 50%;
//   left: 30%;
//   transform: translate(-50%, -50%);
//   border-radius: 50%;
//   filter: blur(60px);
//   box-shadow: 0 0 100px 50px rgba(255, 140, 0, 0.5);
//   z-index: 1;
//   animation: rotate 10s linear infinite, pulse 2s infinite;

//   @keyframes rotate {
//     from { transform: translate(-50%, -50%) rotate(0deg); }
//     to { transform: translate(-50%, -50%) rotate(360deg); }
//   }

//   @keyframes pulse {
//     0% {
//       width: 400px;
//       height: 400px;
//       filter: blur(60px);
//     }
//     50% {
//       width: 450px;
//       height: 450px;
//       filter: blur(80px);
//     }
//     100% {
//       width: 400px;
//       height: 400px;
//       filter: blur(60px);
//     }
//   }
// `;

// const LargeOrangeLight1 = styled.div`
//   width: 150px;
//   height: 150px;
//   background: radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0) 100%);
//   position: absolute;
//   top: 50%;
//   left: 30%;

//   transform: translate(-50%, -50%);
//   border-radius: 50%;
//   filter: blur(30px);
//   box-shadow: 0 0 70px 30px rgba(65, 105, 225, 0.5);
//   z-index: 1;
//   animation: rotate 10s linear infinite;

//   @keyframes rotate {
//     from { transform: translate(-50%, -50%) rotate(0deg); }
//     to { transform: translate(-50%, -50%) rotate(360deg); }
//   }


// `;

// const SmallerBlueLight = styled.div`
//   width: 150px;
//   height: 150px;
//   background: radial-gradient(circle, rgba(100, 149, 237, 1) 0%, rgba(65, 105, 225, 0.8) 50%, rgba(0, 0, 0, 0) 100%);
//   position: absolute;
//   top: 45%;
//   left: 65%;
//   transform: translate(-50%, -50%);
//   border-radius: 50%;
//   filter: blur(30px);
//   box-shadow: 0 0 70px 30px rgba(65, 105, 225, 0.5);
//   z-index: 1;
//   animation: rotate 10s linear infinite;

//   @keyframes rotate {
//     from { transform: translate(-50%, -50%) rotate(0deg); }
//     to { transform: translate(-50%, -50%) rotate(360deg); }
//   }
// `;

// const HaloEffect = styled.div`
//   width: 500px;
//   height: 1000px;
//   border-radius: 50%;
//   border: 2px solid rgb(255, 255, 255);
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   filter: blur(90px);
//   background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
//   z-index: 0;
//   animation: rotate 50s linear infinite;

//   @keyframes rotate {
//     from { transform: translate(-50%, -50%) rotate(0deg); }
//     to { transform: translate(-50%, -50%) rotate(360deg); }
//   }
// `;

// // Animação de brilho das estrelas
// const twinkle = keyframes`
//   0%, 100% { opacity: 0.8; }
//   50% { opacity: 1; }
// `;

// // Estilo base para as estrelas
// const Star = styled.div`
//   width: 1px;
//   height: 1px;
//   background: white;
//   position: absolute;
//   border-radius: 50%;
//   opacity: 0.8;
//   animation: ${twinkle} 2s infinite;
// `;

// // Função para gerar várias estrelas com posições aleatórias
// const generateStars = (count) => {
//   const stars = [];
//   for (let i = 0; i < count; i++) {
//     const x = Math.random() * 100;
//     const y = Math.random() * 100;
//     const delay = Math.random() * 2;
//     stars.push(<Star key={i} style={{ top: `${y}%`, left: `${x}%`, animationDelay: `${delay}s` }} />);
//   }
//   return stars;
// };

// function App() {
//   return (
//     <Router>
//       <Container>
//         <LargeOrangeLight />
//         <LargeOrangeLight1 />
//         <SmallerBlueLight />
//         <HaloEffect />
//         {generateStars(150)}
//         <Sidebar />
//         <QuestoesGeradas />
//         <MainContent>
//           <Routes>
//             <Route path="/" element={<Home />} />
//           </Routes>
//         </MainContent>
//       </Container>
//     </Router>
//   );
// }

// export default App;
