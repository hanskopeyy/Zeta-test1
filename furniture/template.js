import * as THREE from '../three.js/build/three.module.js'

/*

    Gunakan file ini sebagai TEMPLATE PEMBUATAN OBJECT.

    1. Sebelum membuat object, ganti nama Class (Line 27) dan export (Line 122)
       sesuai dengan nama object yang akan dibuat

    2. Basic test material hanya digunakan untuk testing.
    3. Disarankan untuk menambahkan comment nama Sub Object.
    4. Untuk membuat object:
        1. Pembuatan object terdiri dari:
            - Properties
            - Geometry
            - Mesh
            - Positioning
            - Rotating (optional)
        2. Setelah object terbuat, lakukan Group Adding
    5. Untuk melakukan testing, buka object_test.js.
    6. Ikuti petunjuk yang sudah di sediakan di object_test.js
    7. Lakuan Go Live Server pada object_test.HTML
    
*/


class Player
{
    constructor(){
        // basic test color material
        let black = new THREE.MeshBasicMaterial({
            color: 0x000000,
        })
        let green = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        })
        let blue = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
        })
        let red = new THREE.MeshBasicMaterial({
            color: 0xff0000,
        })

        // Stack Height (y)
        let height = 0

        // Object 1 : Leg
        let leg_properties = {
            width: 5,
            height: 15,
            length: 5
        }
        let geo_leg = new THREE.BoxGeometry(
            leg_properties.width,
            leg_properties.height,
            leg_properties.length
        )
        const leg_r = new THREE.Mesh(geo_leg, black)
        leg_r.position.set(5,height+(leg_properties.height/2),0)
        
        const leg_l = new THREE.Mesh(geo_leg, black)
        leg_l.position.set(-5,height+(leg_properties.height/2),0)
        height += leg_properties.height

        // Object 2 : Body
        let body_properties = {
            width: 15,
            height: 20,
            length: 10
        }
        let geo_body = new THREE.BoxGeometry(
            body_properties.width,
            body_properties.height,
            body_properties.length
        )
        const body = new THREE.Mesh(geo_body, green)
        body.position.set(0,height+(body_properties.height/2),0)
        height += body_properties.height

        // Object 3 : Head
        let head_properties = {
            width: 15,
            height: 15,
            length: 15
        }
        let geo_head = new THREE.BoxGeometry(
            head_properties.width,
            head_properties.height,
            head_properties.length
        )
        const head = new THREE.Mesh(geo_head, blue)
        head.position.set(0,height+(head_properties.height/2),0)
        height += head_properties.height

        // Object 4 : Hand
        let hand_properties = {
            width: 5,
            height: 13,
            length: 5
        }
        let geo_hand = new THREE.BoxGeometry(
            hand_properties.width,
            hand_properties.height,
            hand_properties.length
        )
        const hand_l = new THREE.Mesh(geo_hand, black)
        hand_l.position.set(-10, 28.5,0)

        const hand_r = new THREE.Mesh(geo_hand, black)
        hand_r.position.set(10, 28.5, 0)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(leg_l)
        this.group.add(leg_r)
        this.group.add(body)
        this.group.add(head)
        this.group.add(hand_l)
        this.group.add(hand_r)
    }
}
export default Player;