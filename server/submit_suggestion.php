<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../main.css">
        <title>JSGames</title>

        <style>
            form{
                float:left;
            }

            form input{
                float:left;
            }


    </style>
    </head>
    <body>
        <div class="vertical-menu">
            
            <a href="index.html">Home</a>
            <a href="first.html" class="active">The First</a>
            <a href="piano.html">Piano</a>
            <a href="idle.html">Idle</a>
            <a href="asteroids.html">Asteroids</a>
            <a href="Pong.html">Pong</a>
            <a href="snake.html">Snake</a>
            <a href="spaceships2P.html">Spaceships2P</a>
            <a href="invaders.html">Invaders</a>
            <a href="flappy.html">Flappy</a>

        </div>
            
        <?php
            $name = $_POST['name'] . "\n";
            $message = $_POST['message'] . "\n";
            $date = (date("Y-m-d h:i:sa")) . "\n";

            $file_suggestions = fopen("../data/suggestions.txt", "a");

            fwrite($file_suggestions, $name . $date);
            fwrite($file_suggestions, $message);
            fwrite($file_suggestions, '///////');
            
            fclose($file_suggestions);
        ?>

        <p>Your suggestion has been ackonwledged. Thank you for your contribution.</p>
        <a href="index.html">
    </body>
</html>