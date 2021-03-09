import { ethers } from "../assets/ether.js";

const provider = new ethers.providers.Web3Provider(window.ethereum)
import { reward, token } from "./common.js";

let rewardMgmtSigner = reward();
getUserBalance();
var conversionRatio;
var pointsBalance;
var tokenBalance;

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
    //REDEEM TOKEN
    $(document).on("click", "#redeem-btn", async function(){
    $("#redeem-btn").attr("disabled", "disabled");
    var token = parseInt($("#redeem-token").val());
    var points = parseInt($("#points").val());
    var existingPoint = parseInt($(".points-bal").text());
    
    console.log("token: "+ token);
    console.log("points: "+ points);
    console.log("existingPoint: "+ existingPoint);
    
    var opClass = ".opClass";
    var button = "#redeem-btn";
    if(points <= existingPoint  && points > 0 && token > 0) {
        await rewardMgmtSigner.redeemToken(token, points).then(async function(tx){       
            $(opClass).text("Waiting for block confirmation..");
            $(opClass).show();
            var succMes =  "Successfully redeemed "+ token +" token.";
            var FailureMes = "Txion failed";
            setTimeout(function () { dispFinalOp(tx.hash, opClass, succMes, FailureMes,button); }, 5000);
            }).catch(function (error){
                console.log("error1");
                    console.log(JSON.stringify(error));
                    var message;	
                    if(error.error) {
                        console.log(error.error.message);
                        message = error.error.message;
                    } else {
                        console.log(error.message);
                        message = error.message;
                    }            
                    $(opClass).text(message);
                    $(opClass).show();
                    $("#points").val(pointsBalance);
                    $("#redeem-token").val(tokenBalance);	
                    $("#redeem-btn").removeAttr("disabled");		
            }); 
    } else {
        $(opClass).text("Invalid points & tokens to redeem");
        $(opClass).show();
        $("#redeem-btn").removeAttr("disabled");
    }     
    });	
    
    async function dispFinalOp(hash, opClass, succMes, failureMes,button) {        
        provider.getTransactionReceipt(hash).then(async function(receipt) {
            console.log("Transaction Receipt: " + receipt);
                if(receipt) {
                    console.log("Transaction status: " +JSON.stringify(receipt.status));
                    if(receipt.status == 1) {				
                        console.log("success");	
                        $(opClass).text(succMes);
                        getUserBalance();             
                    } else {
                        console.log("fail");					
                        $(opClass).text(failureMes);
                    }
                    $(button).removeAttr("disabled");
                } else {
                    setTimeout(function () { dispFinalOp(hash, opClass, succMes, failureMes,button); }, 5000); 
                }
            });		
    }

    // ON LOAD FUNCTIONS
    function loadPointsConvert() {
        var points = parseInt($(".points-bal").text());
        pointsBalance = points;
        var onetPt = parseInt($(".one-usd").text())/1000;

        if($('#usd-convert').is(':checked')) {
            var token = parseInt(onetPt*points);
            tokenBalance = token;
        }
        else{
            var token = parseInt(( points * conversionRatio)/100);
            tokenBalance = token;
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
        loadPointsConvert();
    }