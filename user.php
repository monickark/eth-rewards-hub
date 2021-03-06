<!DOCTYPE html>
<html lang="en">
    <head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Rewards Hub -User</title>
		
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
				<li class="nav-item ">
				  <a class="nav-link" href="admin.php">Admin </a>
				</li>
				<li class="nav-item active">
				  <a class="nav-link" href="user.php">User <span class="sr-only">(current)</span></a>
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
					<?php echo ($isChecked == 1 ? 'checked' : '');?>/>
					<?php
					 }
					$conn->close();
					?>		
		<div class="mixs-price"></div> <div class="one-usd"></div>
		  <div class="container">
		  <div class="row">
			<h1 class="col-md-12 text-center"> REWARDS HUB USER FLOW </h1>
			
			<div class="col-md-12">					
					<h3 class="row col-lg-12" >REDEEM TOKEN</h3><div>
					<div class="form-group row col-lg-12">
						<input class="col-lg-2 form-control" id="points" type="text" placeholder="Points to redeem"/>
						<input class="col-lg-2 form-control" id="redeem-token" type="text" placeholder="Tokens to redeem"/>
						<button class="col-lg-2 btn btn-dark" id="redeem-btn">Redeem</button></div>  
						<div class="col-lg-6 alert alert-dark opClass" role="alert"></div>			
					</div>
					
					<h3 class="row col-lg-12" >TOKEN BALANCE : <span class="user-bal"></span> MIXS </h3><div>
					<h3 class="row col-lg-12" >POINTS BALANCE : <span class="points-bal"></span> MIXS </h3>	
			</div>
		  </div>	
		</div>
</body>
	<script>
		$(document).ready(function() {
			$(".opClass").hide(); 
			$(".mixs-price").hide();
			$(".one-usd").hide();
			$("#usd-convert").hide();
		});
	</script>
	<script type="text/javascript" src="https://unpkg.com/web3@1.2.11/dist/web3.min.js"></script>
    <script type="text/javascript" src="https://unpkg.com/web3modal@1.9.0/dist/index.js"></script>
    <script type="text/javascript" src="https://unpkg.com/evm-chains@0.2.0/dist/umd/index.min.js"></script>
    <script type="text/javascript" src="https://unpkg.com/@walletconnect/web3-provider@1.2.1/dist/umd/index.min.js"></script>
	<script type="text/javascript" src="https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js"></script>
	<!-- This is our example code -->
	<script type="module" src="js/example.js"></script>
	<!-- <script type="text/javascript" src="js/example.js"></script> -->
	<script type="module" src="js/user.js"></script>
	<script type="text/javascript" src="js/redeem.js"></script>
	
</html>