import React, { useCallback, useRef, useState, useEffect } from "react";
import './Alertdialog.css'

export default function AlertDialog({open, onClose, text }) {
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
              <h4>{text}</h4>
              <button 
                onClick={handleConfirmExit}
                style={{ 
                  background: "#fcb415",
                  boxShadow: " 0 4px 12px rgba(	252, 180, 21, 0.5)",
                  color: "black" 
                  }} 
                  > Confirmar Saída </button>
              <button 
                onClick={handleContinueRecording}
                style={{color: "black"}}
              >Continuar Gravando</button>
            </div>
          )}
        </div>
      );
}