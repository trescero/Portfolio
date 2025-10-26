<?php
// Inclure les fichiers nécessaires de PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Créer un nouvel objet PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuration de base sans serveur SMTP
    $mail->isMail();  // Utilise la fonction mail() par défaut de PHP
    
    // Définir les paramètres de l'email
    $mail->setFrom('expediteur@example.com', 'Nom de l\'expéditeur');
    $mail->addAddress('destinataire@example.com', 'Nom du destinataire');
    $mail->Subject = 'Test d\'envoi avec PHPMailer sans SMTP';
    $mail->Body    = 'Ceci est un message de test envoyé avec PHPMailer sans spécifier de serveur SMTP.';
    
    // Envoyer l'email
    $mail->send();
    echo 'L\'email a été envoyé avec succès !';
} catch (Exception $e) {
    echo "L'email n'a pas pu être envoyé. Erreur: {$mail->ErrorInfo}";
}
