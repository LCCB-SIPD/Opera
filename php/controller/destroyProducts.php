<?php

include '../access/server.php';

include '../access/nodejs.php';

$id = $data['id'] ?? null;

if (empty($id)) {

    echo json_encode([
        'success' => false,
        'message' => 'id Undefined'
    ]);
    exit();
}

$stmt = $pdo->prepare("DELETE FROM product_tbl WHERE id = :id limit 1");
$stmt->execute([
    ':id' => $id
]);

if ($stmt) {

    echo json_encode([
        'success' => true,
        'message' => 'Deleted Successfully'
    ]);

} else {

    echo json_encode([
        'success' => false,
        'message' => 'Somethings Went Wrong'
    ]);

}


?>