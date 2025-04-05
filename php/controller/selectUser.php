<?php 

include '../access/server.php';
include '../access/nodejs.php';

$username = $data['username'] ?? null;
$passwd = $data['passwd'] ?? null;

if (empty($username) || empty($passwd)) {

    echo json_encode([
        'success' => false,
        'message' => 'Invalid Input'
    ]);
    exit();
}

$stmt = $pdo->prepare("SELECT id, username, passwd, email FROM user_tbl WHERE username = ? LIMIT 1");
$stmt->execute([$username]);
$rows = $stmt->fetch(PDO::FETCH_ASSOC);

if ($rows) {

    if (password_verify($passwd, $rows['passwd'])) {

        echo json_encode([
            'success' => true,
            'message' => 'Log in Successfully',
            'dataId' => $rows['id'],
            'dataUsername' => $rows['username'],
            'dataEmail' => $rows['email']
        ]);
    
    } else {
    
        echo json_encode([
            'success' => false,
            'message' => 'incorrect password'
        ]);
    
    }
    exit();    

} else {

    echo json_encode([
        'success' => false,
        'message' => 'User is not Exist'
    ]);
    exit();

}




?>