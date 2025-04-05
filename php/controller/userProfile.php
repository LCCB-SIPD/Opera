<?php 

include '../access/server.php';

include '../access/nodejs.php';

$username = $data['username'] ?? null;

$stmt = $pdo->prepare("SELECT * FROM user_tbl WHERE username = :username LIMIT 1");
$stmt->execute([
    ':username' => $username
]);

$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!empty($result['name']) && !empty($result['birth']) && !empty($result['address'])) {
    
    $data[] = [
        'id' => $result['id'],
        'name' => $result['name'],
        'username' => $result['username'],
        'email' => $result['email'],
        'birth' => $result['birth'],
        'address' => $result['address'],
        'time_created' => $result['time_created']
    ];

    echo json_encode([
        'success' => true,
        'data' => [$data]
    ]);

} else {

    echo json_encode([
        'success' => false,
        'message' => 'Users Not Updated Yet'
    ]);

}



?>