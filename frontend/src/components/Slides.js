import React, { useState } from "react";
import WebcamVideo from "./webcam";
import TermsAndConditions from "./TermsAndConditions";
import "./Slides.css";
import axios from "axios";

function Slides({ slides }) {
  const [index, setIndex] = React.useState(0);
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [is_pesquisador, setIsPesquisador] = React.useState(false);
  const [checked, setChecked] = useState(false);

  const pageReloader = () => {
    setTimeout(function () {
      window.location.reload();
    }, 5000);
  };

  const handlePesquisador = () => {
    setIsPesquisador(!is_pesquisador);
  };

  const handleCheckboxChange = (event) => {
    setChecked((checked) => !checked);
  };

  const handleChange = (event) => {
    if (event.target.id === "insert_nome") setNome(event.target.value);
    else setEmail(event.target.value);
  };

  const handleEmpty = () => {
    if (nome !== "" && email !== "") return false;
    else return true;
  };

  const handleSubmit = (video_name) => {
    if (video_name === "1") {
      window.location.reload();
      return;
    }

    const depoimentoForm = {
      usuario_id: email,
      usuario_nome: nome,
      is_USPIANO: is_pesquisador,
      depoimento_video: video_name,
    };
    try {
      axios.post("http://localhost:3000/api/depoimentos", depoimentoForm);
      alert("Depoimento enviado com sucesso!");
      setIndex(index + 1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div id="navigation" className="text-center"></div>
      <div id="slide" className="card text-center">
        <h1 data-testid="title">{slides[index]["title"]}</h1>

        {slides[index]["text"] && (
          <p style={{ fontSize: "20px" }} data-testid="text">
            {slides[index]["text"]}
          </p>
        )}

        {slides[index]["introducao"] && (
          <p style={{ fontSize: "20px" }} data-testid="introducao">
            Se você é pesquisador da USP e suas competências podem resolver
            problemas das empresas e organizações ou...
            <br></br>
            Se você é da comunidade externa e busca competências úteis para
            resolver seus problemas e ajudar nos seus projetos de inovação...
            <br></br>A AUSPIN quer saber e está aqui para juntar pessoas e
            ideias.
          </p>
        )}

        {slides[index]["quest"] && (
          <p
            style={{ fontSize: "24px", fontWeight: "bold" }}
            data-testid="quest"
          >
            {slides[index]["quest"]}
          </p>
        )}

        {slides[index]["terms"] && <TermsAndConditions />}
        {slides[index]["instruction"] && (
          <p style={{ fontSize: "18px" }}>
            Algumas dicas:
            <br></br>
            <br></br>- Procure olhar diretamente para câmera sem olhar para
            baixo
            <br></br>- Mantenha a posição entro dos limites do quadro
            <br></br>- Fale pausadamente em voz alta
          </p>
        )}

        {slides[index]["checkbox"] && (
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={handleCheckboxChange}
            />
            {slides[index]["checkbox"]}
          </label>
        )}

        {slides[index]["nome"] && (
          <input
            type={"text"}
            id={"insert_nome"}
            name={slides[index]["nome"]}
            autoComplete="off"
            onChange={handleChange}
            placeholder={slides[index]["nome"]}
          />
        )}

        {slides[index]["email"] && (
          <input
            type={"text"}
            id={"insert_email"}
            name={slides[index]["email"]}
            autoComplete="off"
            onChange={handleChange}
            placeholder={slides[index]["email"]}
          />
        )}

        {slides[index]["subtitle"] && (
          <h3 data-testid="subtitle" style={{ marginBlockEnd: "15px" }}>
            {slides[index]["subtitle"]}
          </h3>
        )}

        {slides[index]["camera"] && <WebcamVideo callback={handleSubmit} />}

        {slides[index]["button"] && (
          <button
            style={{ color: "black", fontSize: "14px", letterSpacing: "1px" }}
            data-testid="button-next"
            onClick={() => setIndex(index + 1)}
            disabled={index === slides.length - 1}
            className="small"
          >
            {" "}
            {slides[index]["button"]}
          </button>
        )}

        {slides[index]["prosseguir"] && (
          <button
            style={{ color: "black", fontSize: "14px", letterSpacing: "1px" }}
            data-testid="button-next"
            onClick={() => setIndex(index + 1)}
            disabled={handleEmpty()}
            className="small"
          >
            {" "}
            {slides[index]["prosseguir"]}
          </button>
        )}

        {slides[index]["seguinte"] && (
          <button
            style={{ color: "black", fontSize: "14px", letterSpacing: "1px" }}
            data-testid="button-next"
            onClick={() => setIndex(index + 1)}
            disabled={checked === false}
            className="small"
          >
            {" "}
            {slides[index]["seguinte"]}
          </button>
        )}

        {slides[index]["button1"] && (
          <button
            style={{ textAlign: "left" }}
            data-testid="button-next"
            onClick={() => {
              if (index === 1) {
                handlePesquisador();
              }
              setIndex(index + 1);
            }}
            disabled={index === slides.length - 1}
            className="large"
          >
            {" "}
            {slides[index]["button1"]}
            <br />
            <p
              style={{
                display: "inline",
                fontSize: "0.9em",
                fontWeight: "lighter",
              }}
            >
              domino competências para resolver
            </p>
            <br />
            <p
              style={{
                display: "inline",
                fontSize: "0.9em",
                fontWeight: "lighter",
              }}
            >
              problemas de empresas e organizações
            </p>
          </button>
        )}

        {slides[index]["button2"] && (
          <button
            style={{ textAlign: "left" }}
            data-testid="button-next"
            onClick={() => {
              if (index === 1) {
                setIndex(index + 1);
              } else {
                setIndex(0);
              }
            }}
            disabled={index === slides.length - 1}
            className="large"
          >
            {" "}
            {slides[index]["button2"]}
            <br />
            <p
              style={{
                display: "inline",
                fontSize: "0.9em",
                fontWeight: "lighter",
              }}
            >
              busco pesquisadores da USP para
            </p>
            <br />
            <p
              style={{
                display: "inline",
                fontSize: "0.9em",
                fontWeight: "lighter",
              }}
            >
              contribuir na solução de problemas
            </p>
          </button>
        )}

        {slides[index]["sair"] && (
          <button
            style={{
              marginLeft: "340px",
              background: "#fcb415",
              boxShadow: " 0 4px 12px rgba(	252, 180, 21, 0.5)",
              color: "black",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
            type="reset"
            onClick={() => {
              window.location.reload();
            }}
            disabled={index === slides.length - 1}
            className="small"
          >
            {" "}
            {slides[index]["sair"]}
          </button>
        )}

        {slides[index]["reload"] && pageReloader()}
      </div>
    </div>
  );
}

export default Slides;
