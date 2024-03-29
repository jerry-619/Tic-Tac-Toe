import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import useMountTransition from "../customHook/useMountTransition";
import styles from "../styles/modal.module.css";
import MarkType from "./MarkType";

const Modal = ({ show, onClose, status, restart }) => {

  const [isBrowser, setIsBrowser] = useState(false);
  const hasTransitionedIn = useMountTransition(show, 1000);

  const handleRound = () => {
    onClose();
  }

  const handleRestart = () => {
    sessionStorage.clear();
  }

  useEffect(() => {
    setIsBrowser(true);
    const closeOnEscapeKeyDown = e => {
      if ((e.charCode || e.keyCode) === 27) {
        onClose();
      }
    };
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return () => document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
  }, [onClose]);

  const restartGame = (
    <>
      <div className={styles.modal_header}>
        <h2>Restart Game?</h2>
      </div>
      <div className={styles.modal_body}>
        <div className={styles.modal_btn_container}>
          <button onClick={handleRound} className={styles.quit_btn}>No, Cancel</button>
          <Link to="/">
            <button onClick={handleRestart} className={styles.new_round_btn}>Yes, Restart</button>
          </Link>
        </div>
      </div>
    </>
  )

  const resultModal = (
    <div className={styles.modal_result}>
      <div className={styles.modal_header}>
        {status.isDraw ? <h2>Draw!</h2> : (
          <>
            <h5>{status.isWon ? "Player 1" : "Player 2"} Won🎉</h5>
            <div className={styles.modal_winner_declaration}>
              <MarkType name={status.winner} width='100px' />
              <h3 className={status.winner === "cross" ? styles.modal_cross : styles.modal_circle}>bete mauj kardi</h3>
            </div>
          </>
        )}
      </div>
      <div className={styles.modal_body}>
        <div className={styles.modal_btn_container}>
          <Link to="/">
            <button onClick={handleRestart} className={styles.quit_btn}>Quit</button>
          </Link>
          <button onClick={handleRound} className={styles.new_round_btn}>Next Round</button>
        </div>
      </div>
    </div>
  )

  const modalContent = hasTransitionedIn || show ? (
    <div className={`${styles.modal_overlay} ${hasTransitionedIn && show ? styles.modal_show : styles.modal_hide}`} onClick={onClose}>
      <div className={`${styles.modal} ${hasTransitionedIn && show ? styles.modal_show : styles.modal_hide}`} onClick={e => e.stopPropagation()}>
        {restart ? restartGame : resultModal}
      </div>
    </div>
  ) : null

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal")
    );
  } else {
    return null;
  }
};

export default Modal;