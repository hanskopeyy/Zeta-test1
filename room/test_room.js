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
                position_x: 5,
                position_y: 0,
                position_z: 5
            }
        ]
    }
}
export default Default_Room;
