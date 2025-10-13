import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const ModalPortal = ({ children }) => {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    const el = document.getElementById("modal-root");
    setModalRoot(el);
  }, []);

  if (!modalRoot) return null;

  return createPortal(children, modalRoot);
};

export default ModalPortal;
