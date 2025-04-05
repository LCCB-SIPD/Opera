<?php 

include '../access/server.php';

$user_username = isset($_GET['user_username']) ? $_GET['user_username'] : 0;

$stmt = $pdo->prepare('SELECT profile_pic FROM user_tbl WHERE username = :username');
$stmt->execute([
    ':username' => $user_username
]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!empty($result['profile_pic'])) {

    header("Content-Type: image/jpeg");

    echo $result['profile_pic'];

} else {

    header('Location: https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=');

}


?>