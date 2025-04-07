<?php 

include '../access/server.php';

include '../access/nodejs.php';


$username = $data['user'] ?? null;

if (empty($username)) {

    echo json_encode([
        'success' => false,
        'message' => 'Invalid User Undefined'
    ]);
    exit();
}

$stmt = $pdo->prepare("SELECT id, name, price, quantity, categories, time 
FROM product_tbl 
WHERE owner_user = :owner_user LIMIT 10");

$stmt->execute([
    ':owner_user' => $username
]);

$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($result) || $result === null) {

    echo json_encode([
        'success' => false,
        'message' => 'No Data Found'
    ]);
    exit();
}

$data = [];

foreach($result as $row) {

    $data[] = $row;

}

echo json_encode([
    'success' => true,
    'data' => $data
]);

?>