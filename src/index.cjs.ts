import Grid, * as modules from './index';

for (const name in modules) {
  (Grid as any)[name] = (modules as any)[name];
}

declare const module: any;
module.exports = Grid;
export default Grid;
export * from './index';
