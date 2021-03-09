<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "rewards";
    $checked = $_GET['isChecked'];
    // Create connection
    
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    }
  
    $sql = "UPDATE redeem SET  
    isChecked     = '$checked' 
    WHERE `id` = 1 ";

    if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
    } else {
    echo "Error updating record: " . $conn->error;
    }
     header('location: admin.php');
    $conn->close();
?>