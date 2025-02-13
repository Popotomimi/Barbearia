// React Router Dom
import { Link } from "react-router-dom";

// Icons
import { BsGithub, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  let year = new Date();

  return (
    <footer>
      <div>
        <p>Veja mais projetos no meu Linkedin:</p>
        <Link to="https://www.linkedin.com/in/roberto-de-oliveira-35976621b/">
          {" "}
          <BsLinkedin className="linkedin" />{" "}
        </Link>
      </div>
      <div>
        <span>Barbearia &copy; {year.getFullYear()} </span>
      </div>
      <div>
        <p>Veja meus repositórios:</p>
        <Link to="https://github.com/Popotomimi">
          {" "}
          <BsGithub className="github" />{" "}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
