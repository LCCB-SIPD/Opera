<?php 

include '../access/server.php';

include '../access/nodejs.php';

$username = $data['username'] ?? null;
$email = $data['email'] ?? null;
$passwd = $data['password'] ?? null;

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
        'message' => 'WARNING: Email Not Allowed!!!'
    ]);
    exit();
}

$checkquery = $pdo->prepare("SELECT COUNT(*) FROM user_tbl WHERE username = ? OR email = ?");
$checkquery->execute([$username, $email]);
$countquery = $checkquery->fetchColumn();

if ($countquery > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'User or Email Already Exist!!!'
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
    :passwd
    )
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

