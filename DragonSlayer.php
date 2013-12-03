<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Dragon Slayer</title>

        <script src="DragonSlayer.js"></script>

<script type="text/javascript">

// Create a new player
var player = new Player("0", "Dronkus The Great");
player.initialize();

/*
    Outputs a string to the gameoutput area.
    [INCOMPLETE]
*/
function toGameOutput(message)
{
    // Create new element node
    var newNode = document.createElement("p");
    // newNode.setAttribute("class", "boxedshadow");
    newNode.setAttribute("class", "outputstyle")
    newNode.innerHTML = message;

    //Add element to dynamic content node
    var first = document.getElementById("gameoutput").firstChild;
    if (first) {
        document.getElementById("gameoutput").insertBefore(newNode, first);
    }
    else {
        document.getElementById("gameoutput").appendChild(newNode);
    }
}

/*
    This event handler handles the input from the user and
    passes the action to the player
*/
function userAction_handler(e) 
{
    // Get the action string from the user and pass to player
    if (e.keyCode === 13 && !e.ctrlKey) {
        var useraction = document.getElementById("txtUserAction").value.trim().toLowerCase();
        document.getElementById("txtUserAction").value = "";
        toGameOutput(player.executeAction(useraction));
    }
    return true;
}

/*
    Registers all our event handlers once the page is fully loaded.
    If page is not fully loaded some elements may not exist yet.
*/
function registerEvents()
{
    document.getElementById("txtUserAction").addEventListener("keyup", userAction_handler, false);
}
window.addEventListener("load", registerEvents, false);

</script>
        <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <body>
        <div id="content">

            <div id="playerinfo">
                <div id="playername">
                    <script type="text/javascript">
                        document.write(player.name);
                    </script>
                </div>
            </div>

            <div id="interaction">
                <div id="gameinput">
                    <textarea id="txtUserAction" placeholder="Enter your action here"></textarea>
                </div>

                <div id="gameoutput">
                </div>
            </div>
        </div>
    </body>
</html>
