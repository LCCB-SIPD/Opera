<?php 

include 'server.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$email = $data['email'];
$passwd = $data['password'];

if (empty($username) || empty($email) || empty($passwd)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid Input'
    ]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email Not Allowed!!!'
    ]);
    exit();
}

$stmt = $pdo->prepare("INSERT INTO user_tbl(
    username, 
    email, 
    passwd
) VALUES (
    :username, 
    :email, 
    :passwd)
");

$stmt->execute([
    ':username' => $username,
    ':email' => $email,
    ':passwd' => $passwd
]);

if ($stmt) {
    echo json_encode([
        'success' => true,
        'message' => 'Sign Up Successfully'
    ]);
    exit();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Something Went Wrong..'
    ]);
    exit();
}

?>

