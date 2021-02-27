import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";
const provider = new ethers.providers.Web3Provider(window.ethereum)
import { reward, token } from "./common.js";

let rewardMgmtSigner = reward();
getUserBalance();
var conversionRatio;
    //REDEEM TOKEN
    $(document).on("click", "#redeem-btn", async function(){
    var token = parseInt($("#redeem-token").val());
    var points = parseInt($("#points").val());
    var existingPoint = parseInt($(".points-bal").text());
    
    console.log("token: "+ token);
    console.log("points: "+ points);
    console.log("existingPoint: "+ existingPoint);
    
    var opClass = ".opClass";
    if(points <= existingPoint  && points > 0 && token > 0) {
        await rewardMgmtSigner.redeemToken(token).then(async function(tx){       
            $(opClass).text("Waiting for block confirmation..");
            $(opClass).show();
            var succMes =  "Successfully redeemed "+ token +" token.";
            var FailureMes = "Txion failed";
            setTimeout(function () { dispOp(tx.hash, points, opClass, succMes, FailureMes); }, 5000);
            }).catch(function (error){
                console.log("error");
                console.log(JSON.stringify(error));	
                console.log(error.error.message)	
                $(opClass).text(error.error.message);
                $(opClass).show();		
            }); 
    } else {
        $(opClass).text("Invalid points & tokens to redeem");
        $(opClass).show();
    }
     
    });	
    async function dispOp(hash, points, opClass, succMes, failureMes) {
    provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " + receipt);
            if(receipt) {
                console.log("Transaction status: " +JSON.stringify(receipt.status));
                if(receipt.status == 1) {				
                    console.log("success");		
                    console.log(points);			
                    await rewardMgmtSigner.deductPoints(points).then(async function(tx){
                        setTimeout(function () { dispFinalOp(tx.hash, points, opClass, succMes, failureMes); }, 5000);
                    }).catch(function (error){
                        console.log("inner error");		
                        console.log(JSON.stringify(error));		
                        $(opClass).text(error.error.message);
                    });                      
                } else {
                    console.log("fail");					
                    $(opClass).text(failureMes);
                }
            } else {
                setTimeout(function () { dispOp(hash, points, opClass, succMes, failureMes); }, 5000); 
            }
        });		
    }
    async function dispFinalOp(hash, points, opClass, succMes, failureMes) {        
        provider.getTransactionReceipt(hash).then(async function(receipt) {
            console.log("Transaction Receipt: " + receipt);
                if(receipt) {
                    console.log("Transaction status: " +JSON.stringify(receipt.status));
                    if(receipt.status == 1) {				
                        console.log("success");		
                        console.log(points);  
                        $(opClass).text(succMes);
                        getUserBalance();             
                    } else {
                        console.log("fail");					
                        $(opClass).text(failureMes);
                    }
                } else {
                    setTimeout(function () { dispFinalOp(hash, points, opClass, succMes, failureMes); }, 5000); 
                }
            });		
    }

    // REDEEM TOKENS POINTS & TOKEN CALCULATION    
    $('#usd-convert').click(function(){   
        if($(this).is(':checked')){
            console.log("checked");
            var onetPt = parseInt($(".one-usd").text())/1000;
            var redeemPoint = parseInt($("#points").val());
            var redeemedToken = parseInt(redeemPoint*onetPt);
            console.log("onept : "+ onetPt + " redeemPoint : "+ redeemPoint + " redeemedToken : "+ redeemedToken);
            $("#redeem-token").val(redeemedToken)
        } else{
            var points = parseInt($("#points").val());
            console.log("points : " + points);
            console.log("conversionRatio : " + conversionRatio);
            var token = parseInt(( points * conversionRatio)/100);
            $("#redeem-token").val(token);
            console.log("Token : " + token);
        }
    });
    // $(document).on("change", "#redeem-token", async function(){
    //$('#redeem-token').change(function() {
    jQuery('#redeem-token').on('input', function() {
        console.log("inside token change...........");
        var token = parseInt($("#redeem-token").val());			
        // var wei = parseInt(token)*1e18;
        if($('#usd-convert').is(':checked')) {
            var points = parseInt($(".points-bal").text());
            var onetTk = 1000/parseInt($(".one-usd").text());
            var redeemedPoint = parseInt(onetTk*token);
            console.log("onetTk : "+ onetTk + " token : "+ token + " redeemedPoint : "+ redeemedPoint);
            $("#points").val(redeemedPoint)
        } else {
            var points = parseInt(( token / conversionRatio)*100);
            $("#points").val(points);
            console.log("points : " + points);
        }
    });
    $(document).on("change", "#points", async function(){
        console.log("inside points change...........");
        var points = $("#points").val();			
        // var wei = parseInt(token)*1e18;
        console.log($('#usd-convert').attr('checked'));
        if($('#usd-convert').is(':checked')) {
            console.log("true");
            var onetPt = parseInt($(".one-usd").text())/1000;
            var redeemPoint = parseInt($("#points").val());
            var redeemedToken = parseInt(redeemPoint*onetPt);
            console.log("onept : "+ onetPt + " redeemPoint : "+ redeemPoint + " redeemedToken : "+ redeemedToken);
            $("#redeem-token").val(redeemedToken)
        } else {
            console.log("false");        
            var points = parseInt($("#points").val());
            console.log("points : " + points);
            console.log("conversionRatio : " + conversionRatio);
            var token = parseInt(( points * conversionRatio)/100);
            $("#redeem-token").val(token);
            console.log("Token : " + token);
        }			
});

    // ON LOAD FUNCTIONS
    function loadPointsConvert() {
        var points = parseInt($(".points-bal").text());
        var onetPt = parseInt($(".one-usd").text())/1000;

        if($('#usd-convert').is(':checked')) {
            var token = parseInt(onetPt*points);
        }
        else{
            var token = parseInt(( points * conversionRatio)/100);
        }
        console.log("points : " + points + "onetPt : " + onetPt + "token : " + token)
        $("#points").val(points);
        $("#redeem-token").val(token);
    }
    async function getUserBalance() {
        const userBalance = await rewardMgmtSigner.userBalance();
        $(".user-bal").text(userBalance);
        console.log("userBalance : " + userBalance);

        const cr = await rewardMgmtSigner.conversionRatio();
        console.log("conversionRatio : " + cr);
        conversionRatio = cr;

        const pointsBalance = await rewardMgmtSigner.pointsBalance();
        $(".points-bal").text(pointsBalance);
        console.log("pointsBalance : " + pointsBalance);

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
            loadPointsConvert();
        }
        request.send();
        
    }