import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";
const provider = new ethers.providers.Web3Provider(window.ethereum)
import { reward, token } from "./common.js";
let rewardMgmtSigner = reward();
let tokenSigner = token();	

getTokenBalance();
// Calling create pool function
$(document).on("click", "#pool-create", async function(){
    var token = $("#pool-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    await tokenSigner.approve('0x008F9eA0284BC5803797d92F342a5bE5Da6c2B4F', token)
    .then(async function(receipt) {
        console.log("Transaction receipt : " + receipt.hash);
        setTimeout(await function(){poolCreate(token,receipt.hash); }, 5000);     
    });    
});

async function poolCreate(token,hash) {
    provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
            console.log("success");					
                const tx2 = await rewardMgmtSigner.createPool(token);			
                $(".pool-info").text(token+ " MIXS tokens added in pool");
                console.log("Transaction2 : " + tx2.hash);	
            } else {
                console.log("fail");					
                $(".pool-info").text("Txion failed");
                $(".pool-info").show();
            }
        } else {
            setTimeout(await function(){poolCreate(token,hash); }, 5000);
        
        }
    });		
}


$(document).on("click", "#txion-btn", async function(){
    var token = $("#max-txion-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);
    
    const tx = await rewardMgmtSigner.setTranLimit(token).then(async function(tx){
        $(".txion-success").text("Waiting for block confirmation...");
        $(".txion-success").show();
        setTimeout(await function(){txionDispResult(token, tx.hash); }, 5000);
    });			
});

async function txionDispResult(token, hash) {
    console.log(token);
    console.log("Transaction : " + hash);
    rewardMgmtSigner.provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
            console.log("success");					
                $(".txion-success").text("Now user can transfer max " +token+ " tokens per transaction");
                $(".txion-success").show();
            } else {
                console.log("fail");					
                $(".txion-success").text("Txion Failed");
                $(".txion-success").show();
            }
        } else {
            setTimeout(await function(){txionDispResult(token, hash); }, 5000);
        }
    });		
}


$(document).on("click", "#day-btn", async function(){
    var token = $("#max-day-token").val();
    // var wei = parseInt(token)*1e18;
    console.log("token: "+ token);

    const tx = await rewardMgmtSigner.setDayLimit(token).then(async function(tx){
        $(".day-success").text("Waiting for block confirmation...");
        $(".day-success").show();
        setTimeout(await function(){dayDispResult(token, tx.hash); }, 5000);
    });			
});

async function dayDispResult(token, hash) {
    console.log(token);
    console.log("Transaction : " + hash);
    rewardMgmtSigner.provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
            console.log("success");					
                $(".day-success").text("Now user can transfer max " +token+ " tokens per day");
                $(".day-success").show();
            } else {
                console.log("fail");					
                $(".day-success").text("Txion Failed");
                $(".day-success").show();
            }
        } else {
            setTimeout(await function(){dayDispResult(token, hash); }, 5000);
        }
    });		
}

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

    const tx = await rewardMgmtSigner.setConversionRatio(value).then(async function(tx){
        $(".ratio-success").text("Waiting for block confirmation...");
        $(".ratio-success").show();
        setTimeout(await function(){ratioDispResult(value, tx.hash); }, 5000);
    });
});

async function ratioDispResult(value, hash) {
    console.log(value);
    console.log("Transaction : " + hash);
    rewardMgmtSigner.provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
            console.log("success");					
                $(".ratio-success").text("Points to token convertion ratio changed to "+ value + "%");
                $(".ratio-success").show();
            } else {
                console.log("fail");					
                $(".ratio-success").text("Txion failed");
                $(".ratio-success").show();
            }
        } else {
            setTimeout(await function(){ratioDispResult(value, hash); }, 5000);
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
}


$(document).on("click", "#points-btn", async function(){
    var points = $("#points").val();
    var address = $("#address").val();
    console.log("points: "+ points + " Address: "+address);
    
    const tx = await rewardMgmtSigner.setPointsToUser(points,address).then(async function(tx){
        $(".points-success").text("Waiting for block confirmation...");
        $(".points-success").show();
        setTimeout(await function(){pointsDispResult(address, points, tx.hash); }, 5000);
    });			
});

async function pointsDispResult(address, points, hash) {
    console.log(points);
    console.log(address);
    console.log("Transaction : " + hash);
    rewardMgmtSigner.provider.getTransactionReceipt(hash).then(async function(receipt) {
        console.log("Transaction Receipt: " +receipt);
        if(receipt) {
            if(receipt.status == 1) {
            console.log("success");					
                $(".points-success").text("Points " +points+ " for the user " + address + " successfully set");
                $(".points-success").show();
            } else {
                console.log("fail");					
                $(".points-success").text("Txion Failed");
                $(".points-success").show();
            }
        } else {
            setTimeout(await function(){pointsDispResult(address, points, hash); }, 5000);
        }
    });		
}
