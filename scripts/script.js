let Userinput;
let responseText;
let searchButton;
const separatingChars = [",", ";"];

class PokeInfo {
    constructor(name, types) {
        this.name = name;
        this.types = types;
    }
}

function load() {
    responseText = document.getElementById("text");
    searchButton = document.getElementById("searchButton");
    Userinput = [document.getElementById("pokename").value];
}

function main() {
    clearResponseText()
    const result = [];

    searchButton.disabled = true;

    for (let i = 0; i < Userinput.length; i++) {
        makeRequest(i, Userinput, result);
    }

    async function makeRequest(arrayIndex, inputArray, outputArray) {
        const pokemonName = inputArray[arrayIndex];


        fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonName.trim())
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            outputArray.push(new PokeInfo(data.name, data.types));

                            if (outputArray.length == inputArray.length) {
                                console.log("last pokemon reached");
                                printOrganizedResults(outputArray)
                            }

                        });
                } else {
                    console.error("Unknown pokemon: " + pokemonName);
                    alert("Unknown pokemon: " + pokemonName);
                }
            });

    }


    function printOrganizedResults(unorganizedResults) {
        let organizedResults = organizeResults(unorganizedResults)


        printResults();

        function printResults() {
            organizedResults.forEach(element => {
                responseText.innerHTML += "<br>" + capitalizeFirstLetter(element.name) + ": [";
                for (let j = 0; j < element.types.length; j++) {
                    const types = element.types[j];
                    responseText.innerHTML += " " + capitalizeFirstLetter(types.type.name);
                    responseText.innerHTML += j == element.types.length - 1 ? " " : ",";
                }
                responseText.innerHTML += "]";
            });

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

        }

        function organizeResults(unorganizedResults) {
            return unorganizedResults.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                if (b.name > a.name) {
                    return -1;
                }
                return 0;
            });
        }
    }
}

function updateInput(component) {

    clearResponseText();
    searchButton.disabled = false;

    let text = component.value;

    for (let i = 0; i < separatingChars.length; i++) {
        let element = separatingChars[i];

        if (text.search(element) != -1) {
            Userinput = text.split(element);
            return;
        }

        Userinput = [text];
    }
}

function clearResponseText() {
    responseText.innerHTML = "";
}