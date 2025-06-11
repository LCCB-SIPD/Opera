<?php 

include '../access/server.php';

include '../access/nodejs.php';

$username = $data['username'] ?? null;


if (empty($username)) {

    echo json_encode([
        'success' => false,
        'message' => 'Invalid User Undefined'
    ]);
    exit();
}

$stmt = $pdo->prepare("SELECT *
FROM ordered_tbl 
WHERE username_from = :username_from OR username_to = :username_to LIMIT 10");

$stmt->execute([
    ':username_from' => $username,
    ':username_to' => $username
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
