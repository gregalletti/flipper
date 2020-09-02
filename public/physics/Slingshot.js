//triangle
class Slingshot {

    constructor(p1, p2, p3, side) {

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.side = side;

        this.p12_length = p2.sub(p1).getModule();

        this.p13_length = p3.sub(p1).getModule();

        this.p23_length = p3.sub(p2).getModule();

    }

}