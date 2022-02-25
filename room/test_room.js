import Desk from "../furniture/desk.js";

class Default_Room
{
    constructor()
    {
        this.room = {
            x: 8,
            y: 8,
            floor: "ground_test",
            wall: "wall_test"
        }
        
        this.objects = [
            {
                mesh: new Desk().group,
                position_x: 6,
                position_y: 0,
                position_z: 6,
                size_x: 2,
                size_y: 2
            }
        ]
    }
}
export default Default_Room;
