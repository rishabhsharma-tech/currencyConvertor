
const dropdowns = document.querySelectorAll(".dropdowns select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }
        else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Initial flags
updateFlag(fromCurr);
updateFlag(toCurr);

const msg = document.querySelector(".msg");

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = Number(amount.value);

    if (!Number.isFinite(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        const URL = `/api/convert?from=${fromCurr.value}&to=${toCurr.value}&amount=${amtVal}`;

        let response = await fetch(URL);
        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Conversion failed");
        }

        let finalAmount = data.convertedAmount;

        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    } catch (error) {
        console.error(error);
        msg.innerText = "Unable to convert currency. Please try again.";
    }
});
