<?php 

include '../access/server.php';
include '../access/nodejs.php';

$stmt = $pdo->prepare('SELECT * FROM product_tbl LIMIT 20');
$stmt->execute();

$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

$data = [];

foreach($result as $rows) {

    $data[] = [
        'data' => true,
        'id' => $rows["id"],
        'name' => $rows["name"],
        'price' => $rows["price"],
        'owner' => $rows["owner_user"],
        'quantity' => $rows["quantity"],
        'categories' => $rows["categories"],
        'time' => $rows["time"]
    ];

}

echo json_encode($data);

?>