<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'server_addr.php';

try {

$pdo = new PDO(

    "mysql:host=$host;dbname=$dbname;charset=utf8",
    $username,
    $password, // Ensure variable matches
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]
    
);

echo json_encode([ 'success' => true ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Connection Error!'
    ]);
}


?>
