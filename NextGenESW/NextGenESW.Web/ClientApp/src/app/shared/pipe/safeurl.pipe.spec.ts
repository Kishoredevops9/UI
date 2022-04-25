import { SafeurlPipe } from './safeurl.pipe';
let url:any = "";
describe('SafeurlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeurlPipe(url);
    expect(pipe).toBeTruthy();
  });
});
