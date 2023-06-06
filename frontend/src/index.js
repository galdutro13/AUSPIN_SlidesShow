import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {applyPolyfills, defineCustomElements} from 'h8k-components/loader';

const SLIDES = [
    {
        title: "Olá, esse é AUSPIN Quer Saber",
        text: "Se você é pesquisador da USP e suas competências podem resolver problemas das empresas e organizações ou...",
        quest: "Quer deixar seu depoimento?",
        button: "Prosseguir"
    },
    {
        title: "Escolha uma opção",
        button1: "Sou pesquisador USP",
        button2: "Sou de uma empresa ou organização externa"
    },
    {
        title: "Insira seu nome e e-mail nos campos abaixo para continuar.",
        subtitle: "quer continuar e gravar seu depoimento?",
        nome: "NOME COMPLETO",
        email: "ENDEREÇO DE E-MAIL",
        prosseguir: "Sim",
        button2: "Sair"
    },
    {
        title: "TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM",
        terms: "true",
        checkbox: "Aceito",
        seguinte: "Prosseguir"
    },
    {
        title: "TUTORIAL PARA A GRAVAÇÃO",
        text: "Seja objetivo, você terá 3 minutos.\n" +
            "Haverá uma contagem regressiva antes de gravar",
        
        instruction: "Algumas dicas:\n" +
            "- Procure olhar diretamente para câmera sem olhar para baixo\n"+
            "- Mantenha a posição entro dos limites do quadro\n"+
            "- Fale pausadamente em voz alta",
        
        subtitle: "quer continuar e gravar seu depoimento?",
        button1: "Sim",
        button2: "Sair"
    },
    {
        title: "RECORD",
        camera: "video_recorder"
    },
    {
        title: "Muito Obrigado",
        subtitle: "A AUSPIN agradece sua colaboração",
    }
];

ReactDOM.render(<App slides={SLIDES} />, document.getElementById('root'));
registerServiceWorker();

applyPolyfills().then(() => {
    defineCustomElements(window);
})
