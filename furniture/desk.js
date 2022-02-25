import * as THREE from '../three.js/build/three.module.js'

class Desk
{
    constructor(){

        let geometry = new THREE.BoxGeometry(25,2,5)
        let material = new THREE.MeshBasicMaterial({
            color: 0x000000,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0,1,0)
    
        const mesh2 = new THREE.Mesh(geometry, material)
        mesh2.position.set(0,1,0)
        mesh2.rotation.y = Math.PI/2
        let geometry3 = new THREE.BoxGeometry(5,20,5)
        const mesh3 = new THREE.Mesh(geometry3, material)
        mesh3.position.set(0,10,0)
        // const mesh3 = new THREE.Mesh(geometry, material)
        // mesh3.position.set(-10,10,10)
        // const mesh4 = new THREE.Mesh(geometry, material)
        // mesh4.position.set(10,10,-10)
    
        let geometry2 = new THREE.CylinderGeometry(25,25,5,25)
    
        const mesh5 = new THREE.Mesh(geometry2,material)
        mesh5.position.set(0,22.5,0)
    
        this.group = new THREE.Group()
        this.group.add(mesh)
        this.group.add(mesh2)
        this.group.add(mesh3)
        // group.add(mesh4)
        this.group.add(mesh5)
    }
}
export default Desk;