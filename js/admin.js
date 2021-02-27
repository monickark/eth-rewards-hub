import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";
const provider = new ethers.providers.Web3Provider(window.ethereum)
import { reward, token } from "./common.js";
let rewardMgmtSigner = reward();
let tokenSigner = token();	

getTokenBalance();
// Calling create pool function
$(document).on("click", "#pool-create", async function(){
    var token = $("#pool-token").val();
    console.log("token: "+ token);
    var opClass = ".pool-info";

    await tokenSigner.approve('0x789052a77FA074F9Fbc28DB91173f9D726e9efbA', token)
    .then(async function(receipt) {
        $(opClass).text("Waiting for block confirmation...");
        $(opClass).show();
        var succMes =  token+ " MIXS tokens added in pool";	
        var failureMes = "Txion failed";
        console.log("Transaction receipt : " + receipt.hash);
        setTimeout(await function(){poolCreate(token,receipt.hash, opClass,succMes,failureMes); }, 5000);     
    }).catch(function (error){
        console.log("error");
        console.log(JSON.stringify(error));	
        console.log(error.error.message)	
        $(opClass).text(error.error.message);
        $(opClass).show();		
    });    
});

async function poolCreate(token,hash,opClass, succMes,failureMes) {
    provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
            console.log("success");					
                await rewardMgmtSigner.createPool(token).then(async function(tx2) {
                    $(opClass).text(succMes);		
                    console.log("Transaction2 : " + tx2.hash);	
                    setTimeout(await function(){dispResult(token,tx2.hash, opClass,succMes,failureMes); }, 5000);     
                }).catch(function (error){
                    console.log("error");
                    console.log(JSON.stringify(error));	
                    console.log(error.error.message)	
                    $(opClass).text(error.error.message);
                    $(opClass).show();		
                });   
            } else {
                console.log("fail");
                $(opClass).text(failureMes);
            }
        } else {
            setTimeout(await function(){poolCreate(token,hash,opClass, succMes,failureMes); }, 5000);
        
        }
    });		
}

$(document).on("click", "#day-btn", async function(){
    var token = $("#max-day-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    var opClass = ".day-success";

    const tx = await rewardMgmtSigner.setDayLimit(token).then(async function(tx){
        $(opClass).text("Waiting for block confirmation...");
        $(opClass).show();
        var succMes =  "Now user can transfer max " +token+ " tokens per day";
        var failureMes = "Txion failed";
        setTimeout(await function(){dispResult(token, tx.hash, opClass, succMes, failureMes); }, 5000);
    }).catch(function (error){
        console.log("error");
        console.log(JSON.stringify(error));	
        console.log(error.error.message)	
        $(opClass).text(error.error.message);
        $(opClass).show();		
    }); ;			
});

$(document).on("click", "#txion-btn", async function(){
    var token = $("#max-txion-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    var opClass = ".txion-success";

    const tx = await rewardMgmtSigner.setTranLimit(token).then(async function(tx){
        $(opClass).text("Waiting for block confirmation...");
        $(opClass).show();
        var succMes =  "Now user can transfer max " +token+ " tokens per transaction";
        var failureMes = "Txion failed";
        setTimeout(await function(){dispResult(token, tx.hash, opClass, succMes, failureMes); }, 5000);
    }).catch(function (error){
        console.log("error");
        console.log(JSON.stringify(error));	
        console.log(error.error.message)	
        $(opClass).text(error.error.message);
        $(opClass).show();		
    }); ;			
});

$(document).on("change", "#ratio", async function(){
    var value = $("#ratio").val();
    // var wei = parseInt(token)*1e18;
    console.log("Ratio value: "+ value);
    var reflect = "For 100 points you will get " + (100* value)/100 +" tokens";
    $(".ratio-success").text(reflect);
    console.log("ratio : " + value);
});

$(document).on("click", "#ratio-btn", async function(){
    var value = $("#ratio").val();
    // var wei = parseInt(token)*1e18;
    console.log("Ratio value: "+ value);
    var opClass = ".ratio-success";

    const tx = await rewardMgmtSigner.setConversionRatio(value).then(async function(tx){
        $(opClass).text("Waiting for block confirmation...");
        $(opClass).show();
        var succMes =  "Points to token convertion ratio changed to "+ value + "%";
        var failureMes = "Txion failed";
        setTimeout(await function(){dispResult(value, tx.hash, opClass, succMes, failureMes); }, 5000);
    }).catch(function (error){
        console.log("error");
        console.log(JSON.stringify(error));	
        console.log(error.error.message)	
        $(opClass).text(error.error.message);
        $(opClass).show();		
    }); ;
});

$(document).on("click", "#points-btn", async function(){
    var points = $("#points").val();
    var address = $("#address").val();
    console.log("points: "+ points + " Address: "+address);
    var opClass = ".points-success";
    
    const tx = await rewardMgmtSigner.setPointsToUser(points, address).then(async function(tx){
        $(opClass).text("Waiting for block confirmation...");
        $(opClass).show();
        var succMes =  "Points " +points+ " for the user " + address + " successfully set";
        var failureMes = "Txion failed";
        setTimeout(await function(){dispResult(address, points, tx.hash,opClass, succMes, failureMes); }, 5000);
    }).catch(function (error){
        console.log("error");
        console.log(JSON.stringify(error));	
        console.log(error.error.message)	
        $(opClass).text(error.error.message);
        $(opClass).show();		
    }); ;			
});

async function dispResult(token, hash,opClass, succMes, failureMes) {
    // console.log(token);
    // console.log(hash);
    // console.log(opClass);
    // console.log(succMes);
    // console.log(failureMes);
    console.log("Transaction : " + hash);
    rewardMgmtSigner.provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
                console.log("success");					
                $(opClass).text(succMes);
            } else {
                console.log("fail");					
                $(opClass).text(failureMes);
            }
        } else {
            setTimeout(await function(){dispResult(token, hash, opClass, succMes, failureMes); }, 5000);
        }
    });		
}

async function getTokenBalance() {
    const ownerBalance = await rewardMgmtSigner.ownerBalance();
    $(".owner-bal").text(ownerBalance);
    console.log("ownerBalance : " + ownerBalance);

    const poolBalance = await rewardMgmtSigner.poolBalance();
    $(".pool-info").text("Currently " +poolBalance+ " MIXS tokens in pool");
    console.log("poolBalance : " + poolBalance);

    const maxDayToken = await rewardMgmtSigner.maxDayToken();
    $(".day-success").text("User can transfer max " +maxDayToken+ " tokens per day");
    console.log("maxDayToken : " + maxDayToken);
    $("#max-day-token").val(maxDayToken);

    const maxTransToken = await rewardMgmtSigner.maxTransToken();
    $(".txion-success").text("User can transfer max " +maxTransToken+ " tokens per transactions");
    console.log("maxTransToken : " + maxTransToken);
    $("#max-txion-token").val(maxTransToken);

    const conversionRatio = await rewardMgmtSigner.conversionRatio();
    $(".ratio-success").text("User will get " +conversionRatio+ "% of tokens for given points");
    console.log("conversionRatio : " + conversionRatio);
    $("#ratio").val(conversionRatio);

    const owner = await rewardMgmtSigner.owner();
    $(".owner").text("Owner Address :  "+ owner);
    console.log("owner : " + owner);
    $("#ratio").val(conversionRatio);
}
