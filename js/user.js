import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";
const provider = new ethers.providers.Web3Provider(window.ethereum)
import { reward, token } from "./common.js";

let rewardMgmtSigner = reward();
getTokenBalance();
getPointBalance()
var conversionRatio;

$(document).on("click", "#redeem-btn", async function(){
    var token = $("#redeem-token").val();
    var points = $("#points").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    console.log("points: "+ points);

    await rewardMgmtSigner.redeemToken(token).then(async function(tx){
        $(opClass).text("Waiting for block confirmation..");
        $(opClass).show();
        var succMes =  "Successfully redeemed "+ token +" token.";
        var FailureMes = "Txion failed";
        setTimeout(await function(){dispOp(tx.hash, opClass, succMes, FailureMes); }, 5000);
    });	
});

async function dispOp(hash, opClass, succMes, failureMes) {
    console.log(hash);
    console.log(opClass);
    console.log(succMes);
    console.log(failureMes);
    provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
            if(receipt) {
                if(receipt.status == 1) {
                    console.log("success");	
                    const tx2 = await rewardMgmtSigner.deductPoints(points);				
                    console.log("success");					
                    $(opClass).text(succMes);
                } else {
                    console.log("fail");					
                    $(opClass).text(failureMes);
                }
            } else {
                setTimeout(await function(){dispOp(hash, opClass, succMes, failureMes); }, 5000); 
            }
        });		
    }


$(document).on("change", "#redeem-token", async function(){
    var token = $("#redeem-token").val();			
    // var wei = parseInt(token)*1e18;
    var points = parseInt(( token / conversionRatio)*100);
    $("#points").val(points);
    console.log("points : " + points);
});
$(document).on("change", "#points", async function(){
    var points = $("#points").val();			
    // var wei = parseInt(token)*1e18;
    var token = parseInt(( points * conversionRatio)/100);
    $("#redeem-token").val(token);
    console.log("Token : " + token);			
});

async function getTokenBalance() {
    const userBalance = await rewardMgmtSigner.userBalance();
    $(".user-bal").text(userBalance);
    console.log("userBalance : " + userBalance);

    const cr = await rewardMgmtSigner.conversionRatio();
    console.log("conversionRatio : " + cr);
    conversionRatio = cr;
}

async function getPointBalance() {
    const pointsBalance = await rewardMgmtSigner.pointsBalance();
    $(".points-bal").text(pointsBalance);
    console.log("pointsBalance : " + pointsBalance);
}