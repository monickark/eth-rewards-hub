
import { reward, token } from "./common.js";
let rewardMgmtSigner = reward();
let tokenSigner = token();	

getTokenBalance();
// Calling create pool function
$(document).on("click", "#pool-create", async function(){
    var token = $("#pool-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    const tx1 = await tokenSigner.approve('0x190c67b37DF42B4235A39E7c3c3000C3764D8770', token);
    console.log("Transaction1 : " + tx1.hash);
    const tx2 = await rewardMgmtSigner.createPool(token);			
    $(".pool-success").text(tx2.hash);
    console.log("Transaction2 : " + tx2.hash);
    
});

$(document).on("click", "#txion-btn", async function(){
    var token = $("#max-txion-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    
    const tx = await rewardMgmtSigner.setTranLimit(token);			
    $(".txion-success").text(tx.hash);
    console.log("Transaction : " + tx.hash);
    
});

$(document).on("click", "#day-btn", async function(){
    var token = $("#max-day-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);

    const tx = await rewardMgmtSigner.setDayLimit(token);			
    $(".day-success").text(tx.hash);
    console.log("Transaction : " + tx.hash);
});

$(document).on("change", "#ratio", async function(){
    var value = $("#ratio").val();
    // var wei = parseInt(token)*1e18;
    console.log("Ratio value: "+ value);
    var reflect = "For 100 tokens you will get " + (100* value)/100 +" tokens";
    $(".ratio-success").text(reflect);
    console.log("ratio : " + value);
});

$(document).on("click", "#ratio-btn", async function(){
    var value = $("#ratio").val();
    // var wei = parseInt(token)*1e18;
    console.log("Ratio value: "+ value);

    const tx = await rewardMgmtSigner.setConversionRatio(value);			
    $(".ratio-success").text(tx.hash);
    console.log("ratio-success : " + tx.hash);
});

async function getTokenBalance() {
    const ownerBalance = await rewardMgmtSigner.ownerBalance();
    $(".owner-bal").text(ownerBalance);
    console.log("ownerBalance : " + ownerBalance);

    const poolBalance = await rewardMgmtSigner.poolBalance();
    $(".pool-info").text("Currently " +poolBalance+ " MIXS tokens in pool");
    console.log("poolBalance : " + poolBalance);

    const maxDayToken = await rewardMgmtSigner.maxDayToken();
    $(".day-success").text("User can transfer only " +maxDayToken+ " tokens per day");
    console.log("maxDayToken : " + maxDayToken);
    $("#max-day-token").val(maxDayToken);

    const maxTransToken = await rewardMgmtSigner.maxTransToken();
    $(".txion-success").text("User can transfer only " +maxTransToken+ " tokens per transactions");
    console.log("maxTransToken : " + maxTransToken);
    $("#max-txion-token").val(maxTransToken);

    const conversionRatio = await rewardMgmtSigner.conversionRatio();
    $(".ratio-success").text("User will get " +conversionRatio+ "% of tokens for given points");
    console.log("conversionRatio : " + conversionRatio);
    $("#ratio").val(conversionRatio);
}
