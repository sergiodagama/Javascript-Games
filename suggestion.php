<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="main.css">
        <title>JSGames</title>

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
        <!-- Make a form to send suggestions that are logged in a text file -->
        <form id="suggestion" action = "server/submit_suggestion.php" method="post">
        <input type="text" name="name" placeholder="Your name"><br>
        <textarea name="message" rows="10" cols="100" form="suggestion" placeholder="Your suggestion"></textarea><br>
        <input type="submit" value="Submit">
        </form>     
    </body>
</html>