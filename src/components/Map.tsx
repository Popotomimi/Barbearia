const Map = () => {
  return (
    <div className="maps-container">
      {" "}
      <h1>Localização:</h1>{" "}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1828.0976657697122!2d-46.782897044280496!3d-23.597326647604845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce55ab7ae71ff9%3A0xa44be7c84039c334!2sAv.%20Eng.%20Heitor%20Ant%C3%B4nio%20Eiras%20Garcia%2C%206064%20-%20Jardim%20Esmeralda%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005564-200!5e0!3m2!1spt-BR!2sbr!4v1739475197774!5m2!1spt-BR!2sbr"
        loading="lazy"></iframe>{" "}
    </div>
  );
};

export default Map;
