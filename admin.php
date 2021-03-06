<!DOCTYPE html>
<html lang="en">
    <head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Rewards Hub -Admin</title>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.2.11/web3.min.js" integrity="sha512-6lf28FmolQdo4ap44cXw7j+thYEZzS1/kXxDkX1ppO//SHCageBS1HmYdqkkL819WfGtQ+7TE+uXEwsxjJXEKQ==" crossorigin="anonymous"></script> -->
		
</script>
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="index.css">
    </head>
	
    <body > 
		<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
			<a class="navbar-brand" href="#">Rewards Hub</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" 
			data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
			aria-expanded="false" aria-label="Toggle navigation">
			  <span class="navbar-toggler-icon"></span>
			</button>
		  
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
			  <ul class="navbar-nav mr-auto">
				<li class="nav-item active">
				  <a class="nav-link" href="admin.php">Admin <span class="sr-only">(current)</span> </a>
				</li>
				<li class="nav-item">
				  <a class="nav-link" href="user.php">User</a>
				</li>
			  </ul>
			</div>
			<div id="prepare">
				<button class="btn btn-primary" id="btn-connect">
				  Connect wallet
				</button>
			  </div>
	
			  <div id="connected" style="display: none">	
				<button class="btn btn-primary" id="btn-disconnect">
				  Disconnect wallet
				</button>	
			  </div>
			<div id="selected-account"></div> 
		  </nav>
		  <div class="container">
		  <div class="row">
			<h1 class="col-md-12 text-center"> REWARDS HUB ADMIN FLOW </h1>
			<h5 class="col-md-12 owner text-center"></h5>
			<div class="col-md-6">
				<h2 class="row col-lg-12" >POOL CREATION</h2>
					<div class="form-group row col-lg-12">
						<input class="col-lg-8 form-control" id="pool-token" type="text" placeholder="Tokens for pool creation"/>
						<button class="col-lg-4 form-control btn btn-warning" id="pool-create">Create</button>  
						<div class="col-lg-12 alert alert-light pool-info" role="alert"></div>			
					</div>
				<h2 class="row col-lg-12" >MAX TOKENS PER TRANSACTION</h2>
					<div class="form-group row col-lg-12">
						<input class="col-lg-8 form-control" id="max-txion-token" type="text" placeholder="Max tokens per transaction"/>
						<button class="col-lg-4 form-control btn btn-success" id="txion-btn">Set</button>  
						<div class="col-lg-12 alert alert-success txion-success" role="alert"></div>			
					</div>
					
					<h3 class="row col-lg-12" >MAX TOKENS PER DAY</h3>
					<div class="form-group row col-lg-12">
						<input class="col-lg-8 form-control" id="max-day-token" type="text" placeholder="Max tokens per day"/>
						<button class="col-lg-4 form-control btn btn-dark" id="day-btn">Set</button> 
						<div class="col-lg-12 alert alert-dark day-success" role="alert"></div>			
					</div><hr/>
			</div>
			<div class="col-md-6">
				<h2 class="row col-lg-12" >POINTS TO TOKEN CONVERSION RATIO</h2>
					<div class="form-group row col-lg-12">
						<input class="col-lg-8 form-control" id="ratio" type="text" placeholder="Conversion ratio"/>
						<button class="col-lg-4 form-control btn btn-info" id="ratio-btn">Set</button> 
						<div class="col-lg-12 alert alert-info ratio-success" role="alert"></div>			
					</div>
				<h2 class="row col-lg-12" >ADD POINTS</h2>
					<div class="form-group row col-lg-12">
						<input class="col-lg-12 form-control" id="address" type="text" placeholder="Address"/>
						<input class="col-lg-8 form-control" id="points" type="text" placeholder="Points"/>
						<button class="col-lg-4 form-control btn btn-danger" id="points-btn">Add</button> 
						<div class="col-lg-12 alert alert-danger points-success" role="alert"></div>			
					</div>
				<h2 class="row col-lg-12" >REDEEM CONDITION</h2>
				<div class="form-group row col-lg-12"></div>	
					<p class="col-lg-12"> 1 MIXS token = <span class="mixs-price"></span> USD || 1000 points = 1 USD || 1000 points = <span class="one-usd"></span> MIXS token</p>
					<p class="col-lg-12">	
				<?php
					$servername = "localhost";
					$username = "root";
					$password = "";
					$dbname = "rewards";
					$isChecked;
					// Create connection
					$conn = new mysqli($servername, $username, $password, $dbname);
					// Check connection
					if ($conn->connect_error) {
					die("Connection failed: " . $conn->connect_error);
					}
					$sql = "SELECT id, isChecked FROM redeem";
					$result = $conn->query($sql);

					if ($result->num_rows > 0) {
					while($row = $result->fetch_assoc()) {
						$isChecked= $row["isChecked"];
					}			
				?>
					<input type="checkbox" id="usd-convert" name="usd-convert" 
					onclick="location.href = 'update.php?isChecked=<?php if ($isChecked == 1) 
					{?>0<?php } else {?>1<?php } ?>';"
					<?php echo ($isChecked == 1 ? 'checked' : '');?>/>
					<?php
					 }
					$conn->close();
					?>				
						<label for="usd-convert"> Need Points to token conversion based on today USD price?</label>
					</p>
				</div>
			</div>
		  </div>	
		</div>
		
</body>
	<script>
		$(document).ready(function() {
			$(".points-success").hide(); 
		});
		
	</script>
	<script type="text/javascript" src="https://unpkg.com/web3@1.2.11/dist/web3.min.js"></script>
    <script type="text/javascript" src="https://unpkg.com/web3modal@1.9.0/dist/index.js"></script>
    <script type="text/javascript" src="https://unpkg.com/evm-chains@0.2.0/dist/umd/index.min.js"></script>
    <script type="text/javascript" src="https://unpkg.com/@walletconnect/web3-provider@1.2.1/dist/umd/index.min.js"></script>
	<script type="text/javascript" src="https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js"></script>
	<!-- This is our example code -->
	<script type="module" src="js/example.js"></script>
	<script type="module" src="js/admin.js"></script>
	<script type="text/javascript" src="js/redeem.js"></script>
</html>