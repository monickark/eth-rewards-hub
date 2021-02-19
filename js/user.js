import { reward, token } from "./common.js";

let rewardMgmtSigner = reward();
getTokenBalance();
var conversionRatio;

$(document).on("click", "#redeem-btn", async function(){
    var token = $("#redeem-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);

    await rewardMgmtSigner.redeemToken(token).then(async function(tx){
        $(".redeem-success").text("Waiting for block confirmation..");
        $(".redeem-success").show();
        setTimeout(await function(){dispResult(token, tx.hash); }, 5000);
    });	
});

async function dispResult(token, hash) {
        console.log(token);
        console.log(hash);
        provider.getTransactionReceipt(hash).then(async function(receipt) {
            console.log("Transaction Receipt: " +receipt);
            if(receipt) {
                if(receipt.status == 1) {
                console.log("success");					
                    $(".redeem-success").text("Successfully redeemed "+ token +" token .");
                    $(".redeem-success").show();
                } else {
                    console.log("fail");					
                    $(".redeem-success").text("Txion failed");
                    $(".redeem-success").show();
                }
            } else {
                setTimeout(await function(){dispResult(token, hash); }, 5000);
            
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
