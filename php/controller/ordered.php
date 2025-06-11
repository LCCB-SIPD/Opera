<?php

include '../access/server.php';
include '../access/nodejs.php';

$data = json_decode(file_get_contents('php://input'), true);  // Assuming JSON payload
$username = $data['username'] ?? null;
$owner = $data['owner'] ?? null;
$txHash = $data['txHash'] ?? null;
$name = $data['name'] ?? null;
$address = $data['address'] ?? null;
$sellerAddress = $data['sellerAddress'] ?? null;
$quantity = $data['quanty'] ?? null;  // Renamed variable for readability
$resultVal = $data['resultVal'] ?? null;

if (empty($username)) {
    echo json_encode([
        'success' => false,
        'message' => 'Username is required.'
    ]);
    exit();
}

try {
    // Validate quantity to make sure it's a number
    if (!is_numeric($quantity)) {
        echo json_encode([
            'success' => false,
            'message' => 'Quantity must be a number.'
        ]);
        exit();
    }

    // Prepare the SQL query
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
    )");

    // Execute the query
    $stmt->execute([
        ':trhash' => $txHash, 
        ':pr_name' => $name, 
        ':chain_from' => $address,
        ':chain_to' => $sellerAddress,
        ':username_from' => $username,
        ':username_to' => $owner,
        ':quantity' => $quantity,
        ':value' => $resultVal
    ]);

    // Check if the insert was successful
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create order.'
        ]);
    }

} catch (Exception $e) {
    // Log the error for debugging
    error_log("Error: " . $e->getMessage());

    echo json_encode([
        'success' => false,
        'message' => 'Database error. Please try again later.'
    ]);
}
?>
