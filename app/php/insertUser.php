<?php 

include 'server.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? null;
$email = $data['email'] ?? null;
$passwd = $data['password'] ?? null;
$c_email = $data['c_email'] ?? null;

if (empty($username) || empty($email) || empty($passwd)) {
    echo json_encode([
        'success' => false,
        'message' => 'Undefined Value'
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
    passwd,
    c_email
) VALUES (
    :username, 
    :email, 
    :passwd,
    :c_email)
");

$stmt->execute([
    ':username' => $username,
    ':email' => $email,
    ':passwd' => $passwd,
    ':c_email' => $c_email
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

