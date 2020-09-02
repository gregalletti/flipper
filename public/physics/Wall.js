//line
class Wall {
    constructor(start, end, number) {

        this.start = start;
        this.end = end;
        this.number = number;
        this.length = end.sub(start).getModule();
        this.direction = end.sub(start).normalize();

    }

}