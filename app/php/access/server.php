<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'one_for_all';

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


} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Connection Error!'
    ]);
}


?>