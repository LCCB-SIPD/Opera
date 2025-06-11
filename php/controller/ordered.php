<?php 

include '../access/server.php';
include '../access/nodejs.php';

$username = $data['username'] ?? null;
$owner = $data['owner'] ?? null;
$txHash = $data['txHash'] ?? null;
$name = $data['name'] ?? null;
$address = $data['address'] ?? null;
$sellerAddress = $data['sellerAddress'] ?? null;
$quanty = $data['quanty'] ?? null;
$resultVal = $data['resultVal'] ?? null;

if(empty($username)) {
    echo json_encode([
        'success' => false,
        'message' => 'Undefined'
    ]);
    exit();
}
try {
    
    $stmt = $pdo->prepare("INSERT INTO ordered_tbl(
    trhash, 
    pr_name,
    chain_from,
    chain_to,
    username_from,
    username_to,
    quantity,
    value
) VALUES (
    :trhash, 
    :pr_name, 
    :chain_from,
    :chain_to,
    :username_from,
    :username_to,
    :quantity,
    :value
    )
");

$stmt->execute([
    ':trhash' => $txHash, 
    ':pr_name' => $name, 
    ':chain_from' => $address,
    ':chain_to' => $sellerAddress,
    ':username_from' => $username,
    ':username_to' => $owner,
    ':quantity' => $quanty,
    ':value' => $resultVal
]);

if ($stmt) {
    echo json_encode([
        'success' => true,
        'message' => 'Create Ordered Successfully'
    ]);
    exit();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error Database'
    ]);
    exit();
}
} catch(error) {
    echo json_encode([
        'success' => false,
        'message' => 'Error Database'
    ]);
    exit();
    
}



?>
