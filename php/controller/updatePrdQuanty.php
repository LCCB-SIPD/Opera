<?php 

include '../access/server.php';

include '../access/nodejs.php';

$prId = $data['prId'] ?? null;
$qty = $data['qty'] ?? null;

if (empty($prId)) {
    echo json_encode([
        'success' => false,
        'message' => 'Undefined Value'
    ]);
    exit();
}


$stmt = $pdo->prepare("UPDATE product_tbl SET quantity = :quantity WHERE id = :product_id");
$stmt->execute([
    ':product_id' => $prId,
    ':quantity' => $qty
]);

if ($stmt) {
    echo json_encode([
        'success' => true,
        'message' => 'Purchase Successfully'
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

