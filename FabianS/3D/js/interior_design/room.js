


function room_data(){
    let my_room = [
        // Floor
        [
            0,
            100,
            0,
            90,
            0,
            0,
            width_room,
            width_room,
            "brown",
            1,
            structures[7]
        ],

        // Wall 1 - vorne
        [
            0,
            -150,
            -1000,
            0,
            0,
            0,
            width_room,
            height_wall_floor + 100,
            "brown",
            1,
            structures[11]
        ],

        // Wall 2 - hinten
        [
            0,
            -150,
            1000,
            0,
            0,
            0,
            width_room,
            height_wall_floor + 100,
            "brown",
            1,
            structures[11]
        ],

        // Wall 3 - rechts
        [
            1000,
            -150,
            0,
            0,
            90,
            0,
            width_room,
            height_wall_floor + 100,
            "brown",
            1,
            structures[11]
        ],

        // Wall 4 - links
        [
            -1000,
            -150,
            0,
            0,
            90,
            0,
            width_room,
            height_wall_floor + 100,
            "brown",
            1,
            structures[12]
        ],

        // Decke
        [
            0,
            -400,
            0,
            90,
            0,
            0,
            width_room,
            width_room,
            lights[0],
            1,
            structures[11]
        ],
    ];
    return my_room
}