export const SHAPES = [
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1],[0,0,0]],
  [[0,1,1],[1,1,0],[0,0,0]],
  [[1,1,0],[0,1,1],[0,0,0]],
  [[1,0,0],[1,1,1],[0,0,0]],
  [[0,0,1],[1,1,1],[0,0,0]],
];

export class Tetris {
  constructor(random = Math.random) { this.random = random; this.reset(); }
  reset() {
    this.board = Array.from({length:20}, () => Array(10).fill(0));
    this.bag = []; this.score = 0; this.lines = 0; this.over = false;
    this.next = this.take(); this.spawn();
  }
  get level() { return 1 + Math.floor(this.lines / 10); }
  get speed() { return Math.max(90, 800 * Math.pow(.8, this.level - 1)); }
  take() {
    if (!this.bag.length) {
      this.bag = [0,1,2,3,4,5,6];
      for (let i=6;i>0;i--) {
        const j = Math.floor(this.random()*(i+1));
        [this.bag[i],this.bag[j]] = [this.bag[j],this.bag[i]];
      }
    }
    return this.bag.pop();
  }
  spawn() {
    this.type = this.next; this.next = this.take();
    this.piece = SHAPES[this.type].map(row=>[...row]);
    this.x = Math.floor((10-this.piece.length)/2); this.y = 0;
    if (!this.fits(this.piece,this.x,this.y)) this.over = true;
  }
  fits(piece,x,y) {
    return piece.every((row,dy)=>row.every((cell,dx)=>!cell ||
      (x+dx>=0 && x+dx<10 && y+dy<20 && (y+dy<0 || !this.board[y+dy][x+dx]))));
  }
  move(dx,dy) {
    if (this.over || !this.fits(this.piece,this.x+dx,this.y+dy)) return false;
    this.x+=dx; this.y+=dy; return true;
  }
  rotate() {
    if (this.over) return false;
    const rotated=this.piece[0].map((_,x)=>this.piece.map(row=>row[x]).reverse());
    // Modest wall/floor kicks keep turns usable at the edges of the stack.
    for (const [dx,dy] of [[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1],[0,-2]]) {
      if (this.fits(rotated,this.x+dx,this.y+dy)) {
        this.piece=rotated; this.x+=dx; this.y+=dy; return true;
      }
    }
    return false;
  }
  ghostY() { let y=this.y; while(this.fits(this.piece,this.x,y+1)) y++; return y; }
  hardDrop() {
    if (this.over) return 0;
    const y=this.ghostY(); this.score+=(y-this.y)*2; this.y=y; return this.lock();
  }
  lock() {
    if (this.over) return 0;
    let above=false;
    this.piece.forEach((row,dy)=>row.forEach((cell,dx)=>{
      if (cell) { if (this.y+dy<0) above=true; else this.board[this.y+dy][this.x+dx]=this.type+1; }
    }));
    if (above) {this.over=true; return 0;}
    const remaining=this.board.filter(row=>row.some(cell=>!cell));
    const cleared=20-remaining.length;
    this.score += [0,100,300,500,800][cleared]*this.level;
    this.lines += cleared;
    this.board=[...Array.from({length:cleared},()=>Array(10).fill(0)),...remaining];
    this.spawn(); return cleared;
  }
}
