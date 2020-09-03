//line
class Ramp {
    constructor(start, end) {

        this.start = start;
        this.end = end;
        this.length = end.sub(start).getModule();
    }
}