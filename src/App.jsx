import { useState } from 'react'
import './App.css'

const App = () => {
  const [inputText, setInputText] = useState('')
  const [group, setGroup] = useState('')
  const [category, setCategory] = useState('')
  const [outputObject, setOutputObject] = useState([])

  const handleInputChange = (event) => {
    setInputText(event.target.value)
  }

  const handleGroupChange = (event) => {
    setGroup(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
  }

  const convertTextToObject = () => {
    try {
      // Asegúrate de que cada pregunta esté separada por un salto de línea y comience con un número seguido de un punto.
      const rawQuestions = inputText.trim().split(/\n(?=\d+\.)/)
      if (rawQuestions.length === 0) {
        throw new Error('No se detectaron preguntas en el formato esperado.')
      }

      const questionsArray = rawQuestions.map((rawQuestion, index) => {
        // Divide la pregunta de las respuestas y de la respuesta correcta.
        const questionWithoutNumber = rawQuestion.replace(/^\d+\.\s*/, '');
        const parts = questionWithoutNumber.split(/\nRespuesta Correcta:/)
        if (parts.length < 2) {
          throw new Error(
            `Error en la pregunta ${
              index + 1
            }: no se encuentra la respuesta correcta.`
          )
        }
        const questionParts = parts[0].split(/\n[ABCD]\)/)
        const questionText = questionParts[0].trim()
        const answers = questionParts.slice(1)
        const correctAnswerLetter = parts[1].trim()

        // Encuentra la respuesta correcta basada en la letra proporcionada.
        const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(
          correctAnswerLetter
        )
        if (correctAnswerIndex === -1 || !answers[correctAnswerIndex]) {
          throw new Error(
            `Error en la pregunta ${
              index + 1
            }: letra de respuesta correcta inválida o no encontrada.`
          )
        }
        const correctAnswer = answers[correctAnswerIndex].trim()

        // Filtra las respuestas incorrectas.
        const incorrectAnswers = answers
          .filter((_, index) => index !== correctAnswerIndex)
          .map((answer) => answer.trim())

        return {
          id: String(index + 1),
          question: questionText,
          group: group,
          category: category,
          correct_answer: correctAnswer,
          incorrect_answers: incorrectAnswers,
        }
      })

      setOutputObject(questionsArray)
    } catch (error) {
      // Si hay un error, muestra un alerta con el mensaje de error
      alert(`Se encontró un error: ${error.message}`)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(outputObject, null, 2))
      alert('¡Contenido copiado al portapapeles!')
    } catch (error) {
      alert('Error al copiar el contenido al portapapeles: ' + error)
    }
  }

  const clearFields = () => {
    setInputText('')
    setGroup('')
    setCategory('')
    setOutputObject([])
  }

  const exportToJsonFile = () => {
    const fileContent = `export default ${JSON.stringify(
      outputObject,
      null,
      2
    )};`
    const blob = new Blob([fileContent], {
      type: 'text/javascript;charset=utf-8;',
    })
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.setAttribute('download', `${category}.js`)
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <div className="App">
      <h1>App Para Facilitar La Vida al Rubio</h1>
      <div className="container">
        <div className="column">
          <input
            type="text"
            placeholder="Grupo..."
            value={group}
            onChange={handleGroupChange}
          />
          <input
            type="text"
            placeholder="Categoría..."
            value={category}
            onChange={handleCategoryChange}
          />
          <textarea
            placeholder="Introduce aquí las preguntas..."
            value={inputText}
            onChange={handleInputChange}
          />
          <button onClick={convertTextToObject}>Convertir</button>
          <button onClick={copyToClipboard}>Copiar</button>
          <button onClick={clearFields}>Limpiar</button>
          <button onClick={exportToJsonFile}>Exportar a .js</button>
        </div>
        <div className="column">
          <pre>{JSON.stringify(outputObject, null, 2)}</pre>
        </div>
      </div>
      <button onClick={scrollToTop} className="scrollButton top">
        &#x2191;
      </button>{' '}
      {/* Flecha hacia arriba */}
      <button onClick={scrollToBottom} className="scrollButton bottom">
        &#x2193;
      </button>{' '}
      {/* Flecha hacia abajo */}
    </div>
  )
}

export default App

// MIRAR EL SCROLL
// PONER UN BOTÓN PARA SUBIR ARRIBA DEL TODO Y OTRO PARA BAJAR SI ESTÁS ARRIBA
// INTENTAR CORREGIR LA NUMERACIÓN DENTRO DE LAS PREGUNTAS
