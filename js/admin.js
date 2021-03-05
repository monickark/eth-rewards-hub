import { ethers } from "../assets/ether.js";;
const provider = new ethers.providers.Web3Provider(window.ethereum)
import { reward, token } from "./common.js";
let rewardMgmtSigner = reward();
let tokenSigner = token();	

getTokenBalance();
var ownerBalance;
var poolBalance;
var maxDayToken;
var maxTransToken;
var conversionRatio;
//Calling create pool function

$(document).on("click", "#pool-create", async function(){
    $("#pool-create").attr("disabled", "disabled");
    var token = $("#pool-token").val();
    console.log("token: "+ token);
    var opClass = ".pool-info";
    var button = "#pool-create";
    if(token > 0) {
        await tokenSigner.approve('0x6C889c970AAb3ddc205A9D1863048C79286E5931', token)
        .then(async function(receipt) {
            $(opClass).text("Waiting for block confirmation...");
            $(opClass).show();
            var succMes =  token+ " MIXS tokens added in pool";	
            var failureMes = "Txion failed";
            console.log("Transaction receipt : " + receipt.hash);
            setTimeout(await function(){poolCreate(token,receipt.hash, opClass,succMes,failureMes,button); }, 5000);     
        }).catch(function (error){
            console.log("error");
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
            $("#pool-create").removeAttr("disabled");		
        });
    } else {
        $(opClass).text("Invalid number of tokens for pool creation");
        $(opClass).show();
        $("#pool-create").removeAttr("disabled");
    }    
});

async function poolCreate(token,hash,opClass, succMes,failureMes,button) {
    provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
            console.log("success");					
                await rewardMgmtSigner.createPool(token).then(async function(tx2) {
                    $(opClass).text(succMes);		
                    console.log("Transaction2 : " + tx2.hash);	
                    setTimeout(await function(){dispResult(token,tx2.hash, opClass,succMes,failureMes,button); }, 5000);     
                }).catch(function (error){
                    console.log("error");
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
                    $("#pool-create").removeAttr("disabled");		
                });   
            } else {
                console.log("fail");
                $(opClass).text(failureMes);
            }
        } else {
            setTimeout(await function(){poolCreate(token,hash,opClass, succMes,failureMes,button); }, 5000);
        
        }
    });		
}

$(document).on("click", "#day-btn", async function(){
    $("#day-btn").attr("disabled", "disabled");
    var token = $("#max-day-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    var opClass = ".day-success";
    var button = "#day-btn";

    if(token > 0) {
        const tx = await rewardMgmtSigner.setDayLimit(token).then(async function(tx){
            $(opClass).text("Waiting for block confirmation...");
            $(opClass).show();
            var succMes =  "Now user can transfer max " +token+ " tokens per day";
            var failureMes = "Txion failed";
            setTimeout(await function(){dispResult(token, tx.hash, opClass, succMes, failureMes,button); }, 5000);
        }).catch(function (error){
            console.log("error");
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
            $("#max-day-token").val(maxDayToken)
            $("#day-btn").removeAttr("disabled");		
        });
    } else {
        $(opClass).text("Invalid number of tokens");
        $(opClass).show();
        $("#day-btn").removeAttr("disabled");
    }			
});

$(document).on("click", "#txion-btn", async function(){
    $("#txion-btn").attr("disabled", "disabled");
    var token = $("#max-txion-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    var opClass = ".txion-success";
    var button = "#txion-btn";

    if(token > 0) {
        const tx = await rewardMgmtSigner.setTranLimit(token).then(async function(tx){
            $(opClass).text("Waiting for block confirmation...");
            $(opClass).show();
            var succMes =  "Now user can transfer max " +token+ " tokens per transaction";
            var failureMes = "Txion failed";
            setTimeout(await function(){dispResult(token, tx.hash, opClass, succMes, failureMes,button); }, 5000);
        }).catch(function (error){
            console.log("error");
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
            $("#max-txion-token").val(maxTransToken)
            $("#txion-btn").removeAttr("disabled");	
        });
    } else {
        $(opClass).text("Invalid number of tokens");
        $(opClass).show();
        $("#txion-btn").removeAttr("disabled");	
    }			
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
    $("#ratio-btn").attr("disabled", "disabled");
    var value = $("#ratio").val();
    // var wei = parseInt(token)*1e18;
    console.log("Ratio value: "+ value);
    var opClass = ".ratio-success";
    var button = "#ratio-btn";

    if(value > 0) {
        const tx = await rewardMgmtSigner.setConversionRatio(value).then(async function(tx){
            $(opClass).text("Waiting for block confirmation...");
            $(opClass).show();
            var succMes =  "Points to token convertion ratio changed to "+ value + "%";
            var failureMes = "Txion failed";
            setTimeout(await function(){dispResult(value, tx.hash, opClass, succMes, failureMes,button); }, 5000);
        }).catch(function (error){
            console.log("error");
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
            $("#ratio").val(conversionRatio)
            $("#ratio-btn").removeAttr("disabled");
        });
    } else {
        $(opClass).text("Invalid conversion ratio");
        $(opClass).show();
        $("#ratio-btn").removeAttr("disabled");
    }
});

$(document).on("click", "#points-btn", async function(){
    $("#points-btn").attr("disabled", "disabled");
    var points = $("#points").val();
    var address = $("#address").val();
    console.log("points: "+ points + " Address: "+address);
    var opClass = ".points-success";
    var button = "#points-btn";

    if(points > 0 && address > 0 && Web3.utils.isAddress(address)) {
        const tx = await rewardMgmtSigner.setPointsToUser(points, address).then(async function(tx){
            $(opClass).text("Waiting for block confirmation...");
            $(opClass).show();
            var succMes =  "Points " +points+ " for the user " + address + " successfully set";
            var failureMes = "Txion failed";
            setTimeout(await function(){dispResult(points, tx.hash,opClass, succMes, failureMes,button); }, 5000);
        }).catch(function (error){
            console.log("error");
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
            $("#points-btn").removeAttr("disabled");		
        });
    } else {
        $(opClass).text("Invalid address or points");
        $(opClass).show();
        $("#points-btn").removeAttr("disabled");
    }		
});

async function dispResult(token, hash,opClass, succMes, failureMes, button) {
    console.log(button);

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
            $(button).removeAttr("disabled");
        } else {
            setTimeout(await function(){dispResult(token, hash, opClass, succMes, failureMes, button); }, 5000);
        }
    });		
}

async function getTokenBalance() {
    const _ownerBalance = await rewardMgmtSigner.ownerBalance();
    ownerBalance = _ownerBalance;
    $(".owner-bal").text(_ownerBalance);
    console.log("ownerBalance : " + _ownerBalance);

    const _poolBalance = await rewardMgmtSigner.poolBalance();
    poolBalance = _poolBalance;
    $(".pool-info").text("Currently " +_poolBalance+ " MIXS tokens in pool");
    console.log("poolBalance : " + _poolBalance);

    const _maxDayToken = await rewardMgmtSigner.maxDayToken();
    maxDayToken = _maxDayToken;
    $(".day-success").text("User can transfer max " +_maxDayToken+ " tokens per day");
    console.log("maxDayToken : " + _maxDayToken);
    $("#max-day-token").val(_maxDayToken);

    const _maxTransToken = await rewardMgmtSigner.maxTransToken();
    maxTransToken = _maxTransToken;
    $(".txion-success").text("User can transfer max " +_maxTransToken+ " tokens per transactions");
    console.log("maxTransToken : " + _maxTransToken);
    $("#max-txion-token").val(_maxTransToken);

    const _conversionRatio = await rewardMgmtSigner.conversionRatio();
    conversionRatio = _conversionRatio;
    $(".ratio-success").text("User will get " +_conversionRatio+ "% of tokens for given points");
    console.log("conversionRatio : " + _conversionRatio);
    $("#ratio").val(_conversionRatio);

    const _owner = await rewardMgmtSigner.owner();
    $(".owner").text("Owner Address :  "+ _owner);
    console.log("owner : " + _owner);
}
