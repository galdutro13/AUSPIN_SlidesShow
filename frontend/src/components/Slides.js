import React from 'react';
import WebcamVideo from "./webcam";
function Slides({slides}) {
    const [index, setIndex] = React.useState(0);
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [is_pesquisador, setIsPesquisador] = React.useState(false);

    const handlePesquisador = () => {
        setIsPesquisador(!is_pesquisador);
    }

    const handleChange = event => {
        if(event.target.id === "insert_nome")
            setNome(event.target.value);
        else
            setEmail(event.target.value);

        console.log('value is:', event.target.value);
    }
    return (
        <div>
            <div id="navigation" className="text-center">


                {/*<button
                    data-testid="button-prev"
                    disabled={index === 0}
                    onClick={() => setIndex(index - 1)}
                    className="small"
                >
                    Prev
                </button>*/}

            </div>
            <div id="slide" className="card text-center">
                <h1 data-testid="title">{slides[index]["title"]}</h1>
                {slides[index]["text"] && <p
                    data-testid="text">{slides[index]["text"]}
                </p>}
                {slides[index]["nome"] && <input
                    type={"text"}
                    id={"insert_nome"}
                    name={slides[index]["nome"]}
                    onChange={handleChange}
                    placeholder={slides[index]["nome"]}
                />}
                {slides[index]["email"] && <input
                    type={"text"}
                    id={"insert_email"}
                    name={slides[index]["email"]}
                    onChange={handleChange}
                    placeholder={slides[index]["email"]}
                />}
                {slides[index]["subtitle"] && <h3
                    data-testid="subtitle">{slides[index]["subtitle"]}
                </h3>}
                {slides[index]["camera"] && <WebcamVideo />}
                {slides[index]["button"] && <button
                    data-testid="button-next"
                    onClick={() => setIndex(index + 1)}
                    disabled={index === slides.length - 1}
                    className="small"

                > {slides[index]["button"]}
                </button>}
                {slides[index]["button1"] && <button
                    data-testid="button-next"
                    onClick={() => {
                        if(index === 1) {
                            handlePesquisador();
                        }
                        setIndex(index + 1)
                    }}
                    disabled={index === slides.length - 1}
                    className="small"

                > {slides[index]["button1"]}
                </button>}
                {slides[index]["button2"] && <button
                    data-testid="button-next"
                    onClick={() => {
                        if(index === 1) {
                            setIndex(index + 1)
                        } else {
                            setIndex(0);
                        }
                    }}
                    disabled={index === slides.length - 1}
                    className="small"

                > {slides[index]["button2"]}
                </button>}
            </div>
        </div>
    );

}

export default Slides;
