<?php 

include '../access/server.php';

include '../access/nodejs.php';

$username = $data['username'] ?? null;

$stmt = $pdo->prepare("SELECT * FROM user_tbl WHERE username = :username LIMIT 1");
$stmt->execute([
    ':username' => $username
]);

$result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $data = [
        'id' => $result['id'],
        'name' => $result['name'],
        'username' => $result['username'],
        'email' => $result['email'],
        'birth' => $result['birth'],
        'address' => $result['address'],
        'time_created' => $result['time_created'],
        'walletAddress' => $result['shop_wallet_address']
    ];

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);



?>
