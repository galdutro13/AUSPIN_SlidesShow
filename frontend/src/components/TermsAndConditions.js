import React from 'react';
import './TermsAndConditions.css'; // Import the CSS file
import TermsTheme from './terms-theme.css';

const TermsAndConditions = () => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <div class="terms-container" style={{backgroundColor: '#fff'}}>
      <p>
        Autorizo a utilização das minhas voz e imagem no depoimento que irei gravar 
        nesta interação para que as mesmas possam ser divulgadas nos meios de 
        comunicação da Agência USP de Inovação, o que inclui (mas não se restringe a) redes sociais, 
        boletins e comunicações internas, em meio digital, audiovisual ou impresso, com o propósito 
        de divulgar e estabelecer conexões entre pesquisadores e especialistas da USP e membros da 
        comunidade externa (empresas, investidores, empreendedores, entre diversos outros possíveis 
        interessados e interessadas).
        <br></br>
        <br></br>
        Entendo que a presente autorização é outorgada de forma livre e espontânea, em caráter gratuito, 
        não cabendo qualquer custo ou ônus, a qualquer título, por esta autorização e uso. Entendo ainda 
        que esta está sendo firmada de maneira irrevogável, irretratável, obrigando, inclusive, eventuais 
        herdeiros ou sucessores da(o) outorgante.
        <br></br>
        <br></br>
        Li, Estou de Acordo e Autorizo
      </p>
    </div>
  );
};

export default TermsAndConditions;
