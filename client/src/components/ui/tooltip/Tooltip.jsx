import "./Tooltip.scss";

const Tooltip = ({ text, visible }) => {
  return (
    <div className={`tooltip-wrapper ${visible ? "show" : ""}`}>{text}</div>
  );
};

export default Tooltip;
