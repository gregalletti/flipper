//coords, velocity, acceleration...
class Vec2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //USEFUL METHODS
    add(v)      {return new Vec2(this.x + v.x, this.y + v.y);}
    sub(v)      {return new Vec2(this.x - v.x, this.y - v.y);}   
    scale(s)    {return new Vec2(this.x * s, this.y * s);}
    normalize() {return new Vec2(Math.cos(this.getPhase()), Math.sin(this.getPhase()));}
    dot(v)      {return this.x * v.x + this.y * v.y;}
    normal()    {return new Vec2(- this.y, this.x);}
    invertX()   {return new Vec2(- this.x, this.y);}
    invertY()   {return new Vec2(this.x, - this.y);}    
    getModule() {return Math.hypot(this.x, this.y);}
    getPhase()  {return Math.atan2(this.y, this.x);}
}