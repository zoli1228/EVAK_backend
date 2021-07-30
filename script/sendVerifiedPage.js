function send(username) {

    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="evak_light.css">
        <title>EVAK - Egyszerűsített Villanyszerelő Árajánlat Kezelő rendszer</title>
    </head>
    <body>
    
        <div id="mainWindow">
            
            
            <div class="imgContainer">
                <!--  <img src="https://i.postimg.cc/Jn7XtPZY/EVAK01.png" alt="EVAK main logo"> -->
                <img src="resources/EVAK01.png" alt="EVAK main logo">
                
            </div>
            
            
            <div class="home">
                <h1>Köszönjük ${username}, hogy hitelesítette az email címét.</h1>
                <h3>Mostmár be tud jelentkezni az EVAK rendszerébe.</h3>
                <p>Amennyiben az oldal nem irányítja át Önt 10 másodpercen belül, kattintson <a href="/">ide</a></p>
                
                
                
                
            </div><!-- HOME -->
            
            
            
        </div>
        <script>
            setTimeout(function() {
                window.location.href = "/"
            }, 10000)
        </script>
    </body>
    </html>`
    return html;
}

module.exports = send