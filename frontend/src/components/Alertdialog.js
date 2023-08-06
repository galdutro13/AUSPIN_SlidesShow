import React, { useCallback, useRef, useState, useEffect } from "react";
import './Alertdialog.css'

export default function AlertDialog({open, onClose }) {
    const handleConfirmExit = () => {

        onClose("1");
    };

    const handleContinueRecording = () => {

        onClose("0");
    }

    return (
        <div>
          {open && (
            <div className="dialog-box">
              <p>Deseja sair da gravação?</p>
              <button onClick={handleConfirmExit}>Confirmar Saída</button>
              <button onClick={handleContinueRecording}>Continuar Gravando</button>
            </div>
          )}
        </div>
      );
}