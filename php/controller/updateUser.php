<?php

include '../access/server.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = $_POST['username'] ?? null;
    
    
    if (empty($username)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid Username'
        ]);
        exit();
    }

    $checkStmt = $pdo->prepare('SELECT * FROM user_tbl WHERE username = :username');
    $checkStmt->execute([':username' => $username]);
    $resultCheck = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$resultCheck) {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        exit();
    }

    $name = $_POST['name'] ?: $resultCheck['name'];
    $birth = $_POST['date'] ?? $resultCheck['birth'];
    $address = $_POST['address'] ?: $resultCheck['address'];
    $walletAddress = $_POST['walletAddress'] ?: $resultCheck['shop_wallet_address'];
    
    if (empty($name) || empty($address) || empty($walletAddress)) {
        echo json_encode([
            'success' => false,
            'message' => 'Value Not Found'
        ]);
        exit();
    }

    $img_id = null;
    if (isset($_FILES['img']) && $_FILES['img']['error'] === 0) {
        $img_tmp_name = $_FILES['img']['tmp_name'];
        if (is_uploaded_file($img_tmp_name)) {
            $img_id = file_get_contents($img_tmp_name);
        }
    }

    if ($img_id !== null) {
        $stmt = $pdo->prepare("UPDATE user_tbl SET name = :name, address = :address, birth = :birth, profile_pic = :profile_pic, shop_wallet_address = :walletAddress WHERE username = :username");
        $stmt->execute([
            ':name' => $name,
            ':address' => $address,
            ':birth' => $birth,
            ':profile_pic' => $img_id,
            ':walletAddress' => $walletAddress,
            ':username' => $username
        ]);
    } else {
        $stmt = $pdo->prepare("UPDATE user_tbl SET name = :name, address = :address, birth = :birth, shop_wallet_address = :walletAddress WHERE username = :username");
        $stmt->execute([
            ':name' => $name,
            ':address' => $address,
            ':birth' => $birth,
            ':walletAddress' => $walletAddress,
            ':username' => $username
        ]);
    }

    if ($stmt) {
        echo json_encode([
            'success' => true,
            'message' => 'User Updated Successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Update failed'
        ]);
    }

} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error While Updating'
    ]);
    exit();
}