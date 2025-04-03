<?php 

include '../access/server.php';

include '../access/nodejs.php';

$username = $data['username'] ?? null;
$email = $data['email'] ?? null;

$checkquery = $pdo->prepare("SELECT COUNT(*) FROM user_tbl WHERE username = ? OR email = ?");
$checkquery->execute([$username, $email]);
$countquery = $checkquery->fetchColumn();

if ($countquery > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Email or Username already Exist'
    ]);
    exit();
} else {
    echo json_encode([
        'success' => true,
        'message' => ' -- Mail Successfully Submited -- '
    ]);
    exit();
}

?>