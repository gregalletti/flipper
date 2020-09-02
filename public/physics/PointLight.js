//class for the pointlight that comes out when there is a special collision
class PointLight {
    constructor(position, color, hit) {
        this.position = position;
        this.color = color;
        this.hit = hit;
    }

    makeLight(objPos, color, hit){
        this.position = objPos; 
        this.color = color;
        this.hit = hit;
        setTimeout(()=>{
            this.position = new Vec2(0,0); 
            this.color = "#00000";
            this.hit = "";
        }, 200);
    }
}