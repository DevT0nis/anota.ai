import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importe o SweetAlert2
import QuestoesGeradas from '../components/QuestoesGeradas';

const ErrorMessage = styled.div`
  background-color: #ff4d4f;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1.1em;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
  width: 80vw;
  height: auto;
  color: white;
`;

const Button = styled.button.attrs(props => ({
  primary: props.primary || undefined,
}))`
  background-color: ${props => props.primary ? '#22c713' : '#ff062b'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:disabled {
    background-color: #f10bce;
  }

  &:hover {
    background-color: ${props => props.primary ? '#3da90a' : '#d10424'};
    transform: translateY(-2px);
  }
`;

const TextareaAutosize = styled.textarea`
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 8px;
  resize: none;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4cef0c;
  }
`;

const SavedTranscriptions = styled.div`
  margin-top: 20px;
  background-color: transparent;
  padding: 20px;
  border-radius: 8px;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
`;

const TranscriptionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TranscriptionItem = styled.li`
  display: flex;
  color: white;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #8f10e9, #6a00ff);
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 10px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(248, 246, 246, 0.2);
  }
`;

const RenameContainer = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;

  label {
    margin-right: 10px;
  }

  input {
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 8px;
    margin-right: 10px;
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #4cef0c;
    }
  }
`;

const NoteSaved = () => {
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [savedTranscriptions, setSavedTranscriptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  useEffect(() => {
    fetchSavedTranscriptions();
  }, []);

  const fetchSavedTranscriptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/listar-transcricoes');
      if (response.status === 200) {
        setSavedTranscriptions(response.data.transcricoes);
      } else {
        console.error('Erro ao obter anotações salvas:', response.status);
        setError('Erro ao obter anotações salvas.');
      }
    } catch (error) {
      console.error('Erro ao obter anotações salvas:', error);
      setError('Erro ao obter anotações salvas.');
    }
  };

  const handleSelectFile = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/obter-transcricao/${filename}`);
      if (response.status === 200) {
        setSelectedFile(response.data.filename);
        setEditedContent(response.data.content);
        setEditMode(true);
      } else {
        Swal.fire('Erro', 'Erro ao carregar a anotação para edição.', 'error');
      }
    } catch (error) {
      console.error('Erro ao carregar a anotação para edição:', error);
      Swal.fire('Erro', 'Erro ao carregar a anotação para edição.', 'error');
    }
  };

  const handleSaveEditedTranscription = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/salvar-transcricao-editada/${selectedFile}`, {
        content: editedContent,
      });
      if (response.status === 200) {
        Swal.fire('Sucesso', `Anotação ${selectedFile} editada com sucesso.`, 'success');
        setEditMode(false);
        fetchSavedTranscriptions();
      } else {
        Swal.fire('Erro', 'Erro ao salvar a edição da anotação.', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar a edição da anotação:', error);
      Swal.fire('Erro', 'Erro ao salvar a edição da anotação.', 'error');
    }
  };

  const handleRenameTranscription = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/renomear-transcricao/${selectedFile}`, {
        new_filename: newFileName,
      });
      if (response.status === 200) {
        Swal.fire('Sucesso', `Anotação ${selectedFile} renomeada para ${newFileName} com sucesso.`, 'success');
        fetchSavedTranscriptions();
      } else {
        Swal.fire('Erro', 'Erro ao renomear a anotação.', 'error');
      }
    } catch (error) {
      console.error('Erro ao renomear a anotação:', error);
      Swal.fire('Erro', 'Erro ao renomear a anotação.', 'error');
    }
  };

  const handleDeleteTranscription = async (filename) => {
    try {
      const response = await axios.delete(`http://localhost:5000/excluir-transcricao/${filename}`);
      if (response.status === 200) {
        fetchSavedTranscriptions();
        Swal.fire('Sucesso', `Anotação ${filename} excluída com sucesso.`, 'success');
      } else {
        Swal.fire('Erro', 'Erro ao excluir a anotação.', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir a anotação:', error);
      Swal.fire('Erro', 'Erro ao excluir a anotação.', 'error');
    }
  };

  const handleGenerateQuestions = async (filename) => {
    try {
      const response = await axios.post(`http://localhost:5000/gerar-perguntas/${filename}`);
      if (response.status === 200) {
        setQuestions(response.data.perguntas);
        setShowQuestions(true); // Set the state to open the QuestionsAndAnswers component
      } else {
        throw new Error('Erro ao gerar perguntas.');
      }
    } catch (error) {
      console.error('Erro ao gerar perguntas:', error);
      setError('Erro ao gerar perguntas. Tente novamente mais tarde.');
    }
  };

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {editMode ? (
        <>
          <RenameContainer>
            <label>Novo nome para a anotação:</label>
            <input type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
            <Button primary onClick={handleRenameTranscription}>
              Renomear Anotação
            </Button>
          </RenameContainer>
          <TextareaAutosize rows={10} value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
          <Button primary onClick={handleSaveEditedTranscription}>
            Salvar Edição
          </Button>
          <Button onClick={() => setEditMode(false)}>
            Cancelar Edição
          </Button>
        </>
      ) : (
        <SavedTranscriptions>
          <h3>Anotações Salvas:</h3>
          <TranscriptionList>
            {savedTranscriptions && savedTranscriptions.length > 0 ? (
              savedTranscriptions.map((file, index) => (
                <TranscriptionItem key={index}>
                  {file}
                  <div>
                    <Button primary onClick={() => handleSelectFile(file)}>
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteTranscription(file)}>
                      Excluir
                    </Button>
                    <Button onClick={() => handleGenerateQuestions(file)}>
                      Gerar Perguntas
                    </Button>
                  </div>
                </TranscriptionItem>
              ))
            ) : (
              <p>Nenhuma transcrição salva.</p>
            )}
          </TranscriptionList>
        </SavedTranscriptions>
      )}
      <QuestoesGeradas
        isOpen={showQuestions}
        questions={questions}
        onClose={() => setShowQuestions(false)}
      />
    </Container>
  );
};

export default NoteSaved;
