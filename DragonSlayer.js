/*
Some general thoughts:
- There can be only 1 monster on a tile
- A monster has a description, health, attack power and an image
- You cant pass through a tile without killing the monster
- There can be only 1 item on a tile
- If a tile contains an item and a monster the item will only show up once the monster is killed

- We only request new information from the server when the player moves to a tile from his current location
that is not yet populated.

*/



/*
    Use this to create Tile objects
*/
function Tile(id, description, north_id, east_id, south_id, west_id, image)
{
    this.id = id;
    this.description = description;

    // Id's of adjacent tiles
    this.north_id = north_id;
    this.east_id = east_id;
    this.south_id = south_id;
    this.west_id = west_id;

    // References to adjacent tiles
    this.north = null;
    this.east = null;
    this.south = null;
    this.west = null;

    this.monster = null;
    this.item = null;
    this.image = image;

}

Tile.prototype.toString = function() {
    var out = "[" + this.id + "] ";
    out += this.description;

    out += "<ul>";
    if (this.north_id != null)
        out += "<li>You can go north.</li>";
    if (this.east_id != null)
        out += "<li>You can go east.</li>";
    if (this.south_id != null)
        out += "<li>You can go south.</li>";
    if (this.west_id != null)
        out += "<li>You can go west.</li>";
    out += "</ul>";

    if (this.monster != null) {
        out += "<div>There seems to be a monster here</div>";
    }
    else if (this.item != null) {
        out += "<div>There seems to be an item laying here</div>";
    }

    return out;
}

Tile.prototype.getImage = function(){
    imageOut = this.image;
    return imageOut;
}

/*
    @param initial Should only be set to true for first tile on load
*/
function getPartialMapFromServer(basetile, level, initial)
{
    console.log("AJAX request to server with {tile_id:" + basetile.id + ", level:" + level + "}");

    var xmlhttp;
    if (window.XMLHttpRequest) {    // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // We need to be able to pass the basetile object to the handler so we need some more complex code
    xmlhttp.onreadystatechange = function(){ if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            ajax_ExtendPartialMapFromJson_Callback(xmlhttp, basetile, level, initial);
        }
    };

    xmlhttp.open("GET", "map.php?tile_id=" + basetile.id + "&level=" + level, true);
    xmlhttp.send();
}

function ajax_ExtendPartialMapFromJson_Callback(xmlhttp, basetile, level, initial)
{
    console.log("AJAX response: " + xmlhttp.responseText);
    // Extend the basetile with the new information received from the server
    extendPartialMapFromJson(basetile, xmlhttp.responseText, level, initial);
}

/*
    @param basetile The tile to extend with the new map
    @param jsonstring The json string received from the server
    @param maxlevel Currently not used
    @param initial Should only be set to true for first tile on load
*/
function extendPartialMapFromJson(basetile, jsonstring, maxlevel, initial)
{
    maxlevel = 1;   // NOT IMPLEMENTED YET

    var tiles_from_json = JSON.parse(jsonstring).tiles;
    var monsters_from_json = JSON.parse(jsonstring).monsters;

    // Create a list of monsters
    var monsterlist = new Array();
    for (var i in monsters_from_json) {
        var newMonster = createMonsterFromObj(monsters_from_json[i]);
        monsterlist.push(newMonster);
    }

    if (initial) {    // Start of game (initial position)
        var newbasetile = recursiveCreateTiles(0, maxlevel, null, tiles_from_json, monsterlist);

        // Clone the new info into the basetile (we cant return the basetile since
        // this function is called from async AJAX handler)
        for(var key in newbasetile) {
            basetile[key] = newbasetile[key];
        }
    }    else {      // Player has already been moving in map
        recursiveCreateTiles(1, maxlevel, basetile, tiles_from_json, monsterlist);
    }
}

function recursiveCreateTiles(currlevel, maxlevel, basetile, tilelist, monsterlist)
{
    if (currlevel == 0)
    {
        // Create the first reference tile
        basetile = createTileFromObj(tilelist[0]);
        addMonstersToTile(basetile, monsterlist);

        // Further populate tile map
        recursiveCreateTiles(currlevel+1, maxlevel, basetile, tilelist, monsterlist);

        return basetile;
    }
    else
    {
        // By checking both id and reference we can distinguish between
        // locations that have already been populated and those that should be
        // populated and of course locations that cannot be reached.
        if (basetile.north_id != null && basetile.north == null)
        {
            // Create the actual tile
            var tileobj = findTileWithId(tilelist, basetile.north_id);
            basetile.north = createTileFromObj(tileobj);
            basetile.north.south = basetile;        // Link back to current basetile from new tile
            addMonstersToTile(basetile.north, monsterlist);

            // Further populate tile map
            if (currlevel < maxlevel) {
                recursiveCreateTiles(currlevel+1, maxlevel, basetile.north, tilelist, monsterlist);
            }
        }

        if (basetile.east_id != null && basetile.east == null)
        {
            // Create the actual tile
            var tileobj = findTileWithId(tilelist, basetile.east_id);
            basetile.east = createTileFromObj(tileobj);
            basetile.east.west = basetile;        // Link back to current basetile from new tile
            addMonstersToTile(basetile.east, monsterlist);

            // Further populate tile map
            if (currlevel < maxlevel) {
                recursiveCreateTiles(currlevel+1, maxlevel, basetile.east, tilelist, monsterlist);
            }
        }

        if (basetile.south_id != null && basetile.south == null)
        {
            // Create the actual tile
            var tileobj = findTileWithId(tilelist, basetile.south_id);
            basetile.south = createTileFromObj(tileobj);
            basetile.south.north = basetile;        // Link back to current basetile from new tile
            addMonstersToTile(basetile.south, monsterlist);

            // Further populate tile map
            if (currlevel < maxlevel) {
                recursiveCreateTiles(currlevel+1, maxlevel, basetile.south, tilelist, monsterlist);
            }
        }

        if (basetile.west_id != null && basetile.west == null)
        {
            // Create the actual tile
            var tileobj = findTileWithId(tilelist, basetile.west_id);
            basetile.west = createTileFromObj(tileobj);
            basetile.west.east = basetile;        // Link back to current basetile from new tile
            addMonstersToTile(basetile.west, monsterlist);

            // Further populate tile map
            if (currlevel < maxlevel) {
                recursiveCreateTiles(currlevel+1, maxlevel, basetile.west, tilelist, monsterlist);
            }
        }

        return basetile;
    }
}

function addMonstersToTile(basetile, monsters)
{
    var i = 0;
    while (i < monsters.length && monsters[i].location_id != basetile.id) {
        i++;
    }

    if (i < monsters.length) {
        basetile.monster = monsters[i];
        monsters[i].location = basetile;
    }
}

function findTileWithId(tilelist, id)
{
    // Search for tile with id in tilelist
    var i = 0;
    while (i < tilelist.length && tilelist[i].id != id) {
        i++;
    }

    if (i == tilelist.length) {      // Not found !
        console.error("Tile missing in response with id " + id);
        return null;
    }

    return tilelist[i];
}

function createTileFromObj(obj)
{
    var newTile = new Tile(
        obj.id,
        obj.description,
        obj.north_id,
        obj.east_id,
        obj.south_id,
        obj.west_id,
        obj.image
    );
    return newTile;
}


/*
    Use this to create a player object
*/
function Player(id, name)
{
    this.id = id;
    this.name = name;
    this.currentPosition = null;        // Tile where player currently resides
}

Player.prototype.initialize = function() {
    // Here we should load the player stats from the server
    // health, items, start location, ...

    // Partial map of start location should be loaded
    var locationid = 1;     // TODO: This should be retrieved from server
    this.currentPosition = new Tile(locationid, null, null, null, null, null,null);
    getPartialMapFromServer(this.currentPosition, 2, true);
}

Player.prototype.toString = function() {
    return "Hello, my name is " + this.name + ".";
}

Player.prototype.executeAction = function(userinput) {

    // Split the userinput in tokens
    var usercommand = userinput.split(" ");

    // Execute action
    switch(usercommand[0])
    {
        case 'help':
            return this.help();
            break;

        case 'look':
            return "" + this.currentPosition;
            break;

        case 'go':
            if (usercommand.length == 1) {
                return "Action incomplete! Please supply a valid direction";
            }
            var direction = usercommand[1];

            if (direction == 'north' || direction == 'east' || direction == 'south' || direction == 'west') {
                return this.go(direction);
            }
            else {
                return "You cannot go there.";
            }

            break;

        default:
            return "Unknown command " + usercommand[0];
            break;
    }
}

Player.prototype.help = function() {
    out = "You currently have access to the following commands:";
    out += "<ul>";
    out += "<li>help: gives you a list of commands</li>";
    out += "<li>go <north|east|south|west>: walk in the given direction</li>";
    out += "<li>look: gives a description of your current surroundings</li>";
    out += "</ul>";
    return out;
}

Player.prototype.go = function(to) {

    var start = this.currentPosition;

    if (this.currentPosition.monster != null) {
        return "You cannot move away without killing the monster.";
    }

    if (to == 'north') {
        if (this.currentPosition.north_id != null && this.currentPosition.north != null) {
            // Move player to new location
            this.currentPosition = this.currentPosition.north;

            // Now we need to get all surrounding tiles of current tile
            getPartialMapFromServer(this.currentPosition, 2, false);
        }
    }
    else if (to == 'east') {
        if (this.currentPosition.east_id != null && this.currentPosition.east != null) {
            // Move player to new location
            this.currentPosition = this.currentPosition.east;

            // Now we need to get all surrounding tiles of current tile
            getPartialMapFromServer(this.currentPosition, 2, false);
        }
    }
    else if (to == 'south') {
        if (this.currentPosition.south_id != null && this.currentPosition.south != null) {
            // Move player to new location
            this.currentPosition = this.currentPosition.south;

            // Now we need to get all surrounding tiles of current tile
            getPartialMapFromServer(this.currentPosition, 2, false);
        }
    }
    else if (to == 'west') {
        if (this.currentPosition.west_id != null && this.currentPosition.west != null) {
            // Move player to new location
            this.currentPosition = this.currentPosition.west;

            // Now we need to get all surrounding tiles of current tile
            getPartialMapFromServer(this.currentPosition, 2, false);
        }
    }

    if (start == this.currentPosition) {      // Could not move
        return "You cannot go there.";
    }
    else {
        
        var DOM_img = document.createElement("img");
        DOM_img.src = player.currentPosition.getImage(); 

        // how the image will be displayed
        DOM_img.style.maxHeight="150px";
        DOM_img.style.marginTop="5px";

        //delete previous image
        var tempnode = document.getElementById("tileimage");
        while(tempnode.firstChild) {
            tempnode.removeChild(tempnode.firstChild);
        }

        //place new image in tileimage
        document.getElementById("tileimage").appendChild(DOM_img);

        return "You traveled " + to
;
    }


}


/*
    Use this to create Monster objects
*/
function Monster(id, description, location_id, monster_image)
{
    this.id = id;
    this.description = description;
    this.location_id = location_id;
    // Reference to location
    this.location = null,
     
    this.monster_image = monster_image;
}

Monster.prototype.toString = function() {
    var out = "[" + this.id + "] ";
    out += this.description;
    return out;
}

function createMonsterFromObj(obj)
{
    var newMonster = new Monster(
        obj.id,
        obj.description,
        obj.location_id,
        obj.monster_image
    );
    return newMonster;
}