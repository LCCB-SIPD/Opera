<?php 

include '../access/server.php';
include '../access/nodejs.php';

$search = 48;

if (empty($search)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid User Undefined'
    ]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM product_tbl WHERE id = :name");
$stmt->execute([':name' => $search]);

$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($result)) {
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

// Wrap inside a "product" array
echo json_encode([
    'success' => true,
    'product' => $data
]);
?>