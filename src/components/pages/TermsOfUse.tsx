import Navbar from "../Navbar";
import { TiInfoLarge } from "react-icons/ti";

const TermsOfUse = () => {
  return (
    <div>
      <Navbar />
      <div className="terms-of-use">
        <TiInfoLarge className="info-icon" />
        <h2>Termos de Uso e Política de Privacidade</h2>
        <p>
          Ao enviar este formulário, você concorda com a coleta e armazenamento
          de suas informações, incluindo nome e número de telefone, conforme
          previsto na Lei Geral de Proteção de Dados (LGPD). Garantimos que suas
          informações serão utilizadas apenas para os propósitos necessários ao
          agendamento e não serão compartilhadas com terceiros sem sua
          autorização.
        </p>
        <a href="/">Voltar</a>
      </div>
    </div>
  );
};

export default TermsOfUse;
