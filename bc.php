<?php
require_once '../config/db.php';

class AuthController {

    public function register($name, $email, $password) {
        global $pdo;

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("INSERT INTO users (name,email,password) VALUES (?,?,?)");
        $stmt->execute([$name, $email, $hashedPassword]);
    }

    public function login($email, $password) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if($user && password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            header("Location: /dashboard");
        }
    }
}