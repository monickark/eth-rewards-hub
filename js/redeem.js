let request = new XMLHttpRequest();
        request.open("GET", "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xB0BFB1E2F72511cF8b4D004852E2054d7b9a76e1&vs_currencies=usd", true);
        request.onload = () => {
            console.log(" Request text : "+ request.responseText)
            var resArr = request.responseText.split(":")
            var price = resArr[2].split('}')
            console.log(" USD2 : "+ price[0])
            $(".mixs-price").text(price[0]);
            var oneusd = 1/(parseFloat(price[0]));
            console.log("1 usd have " + oneusd + "token");        
            $(".one-usd").text(oneusd);
        }
        request.send();
