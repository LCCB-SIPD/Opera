<?php 

include '../access/server.php';
include '../access/nodejs.php';

$stmt = $pdo->prepare('SELECT * FROM product_tbl LIMIT 100');
$stmt->execute();

$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($result as $rows) {

    $data[] = [
        'data' => true,
        'id' => $rows["id"],
        'name' => $rows["name"],
        'owner' => $rows["owner_user"],
        'quantity' => $rows["quantity"],
        'categories' => $rows["categories"],
        'time' => $rows["time"]
    ];

}

echo json_encode($data);

?>