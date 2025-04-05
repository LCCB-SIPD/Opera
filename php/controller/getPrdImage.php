<?php 

include '../access/server.php';

$user_id = isset($_GET['prd_id']) ? $_GET['prd_id'] : 0;

$stmt = $pdo->prepare('SELECT product_pic FROM product_tbl WHERE id = :id');
$stmt->execute([
    ':id' => $user_id
]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result) {

    header("Content-Type: image/jpeg");

    echo $result['product_pic'];

} else {

    echo 'No Image Found';

}


?>